import { Object3D, Scene, Vector3 } from "three";
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

type HoleIndicator = {
  locator: Object3D;
  mesh: Object3D;
  active: boolean;
  sensor: Collider;
};

export class HoleSystem {
  private indicators: HoleIndicator[] = [];
  private world: PhysicsWorld;
  private table;
  private scene;

  constructor(world: PhysicsWorld, table: Table, scene: Scene) {
    this.world = world;
    this.table = table;
    this.scene = scene;

    physicsWorldEvent.on("physics:collision", ({ a, b }) => {
      const isBallHole =
        (a?.kind === "ball" && b?.kind === "goal") ||
        (a?.kind === "goal" && b?.kind === "ball");

      if (!isBallHole) return;

      const holeName = a?.kind === "goal" ? a.entityId : b.entityId;

      const holeIndicator = this.indicators.find(
        (i) => i.locator.name === holeName
      );
      if (!holeIndicator || !holeIndicator?.active) return;
      const pos = new Vector3();
      holeIndicator.locator.getWorldPosition(pos);

      gameEvents.emit("goal:entered", {
        holeName,
        pos,
      });
    });
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
}
