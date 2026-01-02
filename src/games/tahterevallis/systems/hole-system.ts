import { Object3D, Vector3 } from "three";
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

type HoleIndicator = {
  locator: Object3D;
  mesh: Object3D;
  active: boolean;
  sensor: Collider;
};

export class HoleSystem implements GameDisposable {
  private indicators: HoleIndicator[] = [];
  private world: PhysicsWorld;
  private table;

  constructor(world: PhysicsWorld, table: Table) {
    this.world = world;
    this.table = table;

    physicsWorldEvent.on("physics:collision", this.onCollision);
  }

  register(locator: Object3D) {
    const mesh = createHoleIndicator();
    locator.add(mesh);

    const sensor = createHoleSensor(locator, 0.1, this.world.getWorld());
    this.world.addColliderMeta(sensor, {
      kind: "goal",
      entityId: locator.name,
    });

    const indicator: HoleIndicator = {
      locator,
      mesh,
      active: false,
      sensor,
    };

    this.indicators.push(indicator);
    return indicator;
  }

  private onCollision = ({ a, b }: any) => {
    const isBallHole =
      (a?.kind === "ball" && b?.kind === "goal") ||
      (a?.kind === "goal" && b?.kind === "ball");

    if (!isBallHole) return;

    const holeName = a?.kind === "goal" ? a.entityId : b.entityId;
    const ballName = a?.kind === "ball" ? a.entityId : b.entityId;

    const holeIndicator = this.indicators.find(
      (i) => i.locator.name === holeName
    );

    if (!holeIndicator || !holeIndicator.active) return;

    const pos = new Vector3();
    holeIndicator.locator.getWorldPosition(pos);
    holeIndicator.active = false;

    gameEvents.emit("goal:entered", {
      ballName,
      holeName: holeName as HoleName,
      pos,
    });
  };

  setActive(locatorName: string, active: boolean) {
    const indicator = this.indicators.find(
      (i) => i.locator.name === locatorName
    );
    if (indicator) {
      indicator.mesh.visible = active;
      indicator.sensor.setEnabled(true);
      indicator.active = active;
    }
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
    for (const indicator of this.indicators) {
      const active = config.holes.goal.includes(
        indicator.locator.name as HoleName
      );
      this.setActive(indicator.locator.name, active);
    }
  }

  update(time: number) {
    for (const i of this.indicators) {
      if (!i.active) continue;
      const s = 1 + Math.sin(time * 4) * 0.05;
      i.mesh.scale.setScalar(s);
    }
  }

  dispose() {
    // 1. Unregister physics event listener
    physicsWorldEvent.off("physics:collision", this.onCollision);

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
