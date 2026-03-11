import { Object3D, Sprite, Texture, Vector3 } from "three";
import {
  createHoleIndicator,
  createHoleSensor,
} from "../factories/hole-factory";
import {
  PhysicsWorld,
  physicsWorldEvent,
} from "@/games/engine/physics/physics-world";
import { Table } from "../objects/table";
import { HoleName, LevelConfig } from "../config";
import { Collider } from "@dimforge/rapier3d";
import { gameEvents } from "..";
import { BallCaptureTarget } from "./ball-system";
import { GameDisposable } from "@/games/types";
import { createGlow } from "../factories/glow-factory";

type HoleIndicator = {
  locator: Object3D;
  mesh: Object3D;
  active: boolean;
  sensor: Collider;
  glow?: Sprite;
};

export class HoleSystem implements GameDisposable {
  private indicators: HoleIndicator[] = [];
  private world: PhysicsWorld;
  private table;
  private scoredPairs = new Set<string>();

  constructor(
    world: PhysicsWorld,
    table: Table,
    private glowTextures: {
      goalGlow: Texture;
      trapGlow: Texture;
    },
  ) {
    this.world = world;
    this.table = table;

    physicsWorldEvent.on("physics:collision", this.onCollision);
  }

  register(locator: Object3D) {
    const mesh = createHoleIndicator("gray");
    locator.add(mesh);

    const glow = createGlow(this.glowTextures.goalGlow);
    locator.add(glow);

    const sensor = createHoleSensor(
      locator,
      0.1,
      this.world.getWorld(),
      this.table.rigidBody,
    );

    const indicator: HoleIndicator = {
      locator,
      mesh,
      active: false,
      sensor,
      glow,
    };

    this.indicators.push(indicator);

    return indicator;
  }

  private onCollision = ({ a, b }: any) => {
    const isBallHoleCollision =
      (a?.kind === "ball" && (b?.kind === "goal" || b?.kind === "trap")) ||
      (b?.kind === "ball" && (a?.kind === "goal" || a?.kind === "trap"));

    if (!isBallHoleCollision) return;

    const hole = a?.kind === "goal" || a?.kind === "trap" ? a : b;
    const ball = a?.kind === "ball" ? a : b;

    const holeName = hole.entityId as HoleName;
    const ballName = ball.entityId;
    const kind = hole.kind;

    const key = `${ballName}::${holeName}`;
    if (this.scoredPairs.has(key)) return;

    const holeIndicator = this.indicators.find(
      (i) => i.locator.name === holeName,
    );

    if (!holeIndicator || !holeIndicator.active) return;

    this.scoredPairs.add(key);

    const pos = new Vector3();
    holeIndicator.locator.getWorldPosition(pos);
    holeIndicator.active = false;
    this.setSolid(holeName);

    if (kind === "trap") {
      gameEvents.emit("collision:trap", {
        ballName,
        holeName: holeName as HoleName,
        pos,
      });
    } else if (kind === "goal") {
      gameEvents.emit("collision:goal", {
        ballName,
        holeName: holeName as HoleName,
        pos,
      });
    }
  };

  setActive(holeName: HoleName, active: boolean) {
    const indicator = this.indicators.find((i) => i.locator.name === holeName);

    if (indicator) {
      indicator.mesh.visible = active;

      indicator.sensor.setEnabled(active);
      indicator.sensor.setSensor(true);
      indicator.active = active;
    }
  }

  setSolid(holeName: HoleName) {
    const indicator = this.indicators.find((i) => i.locator.name === holeName);

    if (!indicator) return;

    // Toggle between sensor and solid collider
    indicator.sensor.setSensor(false);
  }

  registerFromTable() {
    const locators = this.table.getHoleLocators();

    for (const locator of locators) {
      this.register(locator);
    }
  }

  getCaptureTarget(holeName: HoleName): BallCaptureTarget | null {
    const indicator = this.indicators.find((i) => i.locator.name === holeName);
    if (!indicator) return null;

    return {
      anchor: indicator.locator,
      localOffset: new Vector3(0, -0.15, 0),
    };
  }

  applyLevel(config: LevelConfig) {
    this.scoredPairs.clear();
    for (const indicator of this.indicators) {
      const name = indicator.locator.name as HoleName;
      const isGoal = config.holes.goal.includes(name);
      const isTrap = config.holes.trap?.includes(name);
      const kind = isGoal ? "goal" : "trap";

      // Update Physics
      this.world.addColliderMeta(indicator.sensor, {
        kind: kind,
        entityId: name,
      });

      // Determine the color based on the kind
      const hexColor = kind === "goal" ? 0x00ff00 : 0xff0000;

      // Update Mesh Color
      const meshMaterial = (indicator.mesh as any).material;
      if (meshMaterial) meshMaterial.color.setHex(hexColor);

      // Update Glow Color
      if (indicator.glow) {
        indicator.glow.material.color.setHex(hexColor);

        // Optionally swap the texture if goalGlow and trapGlow look different
        indicator.glow.material.map =
          kind === "goal"
            ? this.glowTextures.goalGlow
            : this.glowTextures.trapGlow;

        indicator.glow.material.needsUpdate = true;
      }

      this.setActive(name, isGoal || isTrap);
    }
  }

  update(time: number, elapsed: number) {
    //Hole indicator animation

    for (const i of this.indicators) {
      if (!i.active) continue;
      const s = 1 + Math.sin(time * 4) * 0.05;
      i.mesh.scale.setScalar(s);

      if (i.glow) {
        const pulse = 1 + Math.sin(elapsed * 1.8) * 0.3;
        const s = 1.1 * pulse;

        i.glow.scale.set(s, s, 1);
      }
    }
  }

  dispose() {
    // 1. Unregister physics event listener
    physicsWorldEvent.off("physics:collision", this.onCollision);
    this.scoredPairs.clear();
    // 2. Remove colliders and metadata
    for (const indicator of this.indicators) {
      // Disable sensor first (defensive)
      indicator.sensor.setEnabled(false);

      // Remove metadata + collider from physics world
      this.world.removeColliderMeta(indicator.sensor);

      // 3. Remove Three.js objects
      indicator.locator.remove(indicator.mesh);

      // 4. Dispose geometries/materials if created by you
      indicator.mesh.traverse((obj) => {
        const mesh = obj as any;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            for (const m of mesh.material) m.dispose();
          } else {
            mesh.material.dispose();
          }
        }
      });
    }

    // 5. Clear references
    this.indicators.length = 0;
  }
}
