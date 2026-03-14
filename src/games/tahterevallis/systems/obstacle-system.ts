import { PhysicsWorld } from "@/games/engine/physics/physics-world";
import { GameDisposable } from "@/games/types";
import { Object3D, Scene, Vector3, Group, Quaternion } from "three";

import {
  createCapsuleObstacleBody,
  createCurvedObstacleBody,
  createTubeObstacleBody,
} from "../factories/obstacle-factory";
import type { RigidBody } from "@dimforge/rapier3d";
import { Obstacle, ObstacleType } from "../objects/obstacle";
import { LevelConfig } from "../config";

type ObstacleState = "active" | "inactive";

type ObstacleEntry = {
  id: string;
  type: ObstacleType;
  mesh: Object3D;
  body: RigidBody;
  state: ObstacleState;
};

export class ObstacleSystem implements GameDisposable {
  private obstacles: ObstacleEntry[] = [];
  private obstacleMap = new Map<string, ObstacleEntry>();

  constructor(
    private scene: Scene,
    private physicsWorld: PhysicsWorld,
    private gltf: any,
  ) {
    const availableObstacles: { id: string; type: ObstacleType }[] = [
      { id: "Obstacle_Capsule", type: "OBSTACLE_CAPSULE" },
      { id: "Obstacle_Tube", type: "OBSTACLE_TUBE" },
      { id: "Obstacle_1", type: "OBSTACLE_CURVED" },
    ];

    availableObstacles.forEach((obs) => {
      this.put(obs.id, obs.type);
    });
  }

  /**
   * Registers a new obstacle into the pool
   */
  put(id: string, type: ObstacleType) {
    const obstacle = new Obstacle(this.gltf, id);

    // Use the coordinates FROM the mesh (Blender positions)
    const pos = obstacle.mesh.position;
    const quat = obstacle.mesh.quaternion;
    const { halfHeight, radius } = obstacle.getDimensions();

    let body: RigidBody;

    if (type === "OBSTACLE_CURVED") {
      const { vertices, indices } = obstacle.getGeometryData();
      // Pass the actual position and rotation to the Trimesh
      body = createCurvedObstacleBody(
        vertices,
        indices,
        pos,
        quat,
        this.physicsWorld,
      );
    } else if (type === "OBSTACLE_TUBE") {
      body = createTubeObstacleBody(
        pos,
        quat,
        halfHeight,
        radius,
        this.physicsWorld,
      );
    } else {
      body = createCapsuleObstacleBody(
        pos,
        quat,
        halfHeight,
        radius,
        this.physicsWorld,
      );
    }

    obstacle.attachRigidBody(body);
    this.scene.add(obstacle.mesh); // Start in scene (out of bounds)

    // 3. Define the entry object (Fixing the undefined 'entry' error)
    const entry: ObstacleEntry = {
      id,
      // Converting "OBSTACLE_TUBE" to just "pipe" or "tube" for internal state
      type: type.toLowerCase().replace("obstacle_", "") as any,
      mesh: obstacle.mesh,
      body: body,
      state: "active",
    };

    this.obstacles.push(entry);
    this.obstacleMap.set(id, entry);

    // 4. Set initial state
    //this.deactivateObstacle(entry);
  }

  applyLevel(config: LevelConfig, tableGroup: Group) {
    // 1. Hide all existing obstacles first
    this.obstacles.forEach((obs) => this.deactivateObstacle(obs));
    // 2. Activate only the ones mentioned in config
    config.obstacles?.forEach((obsConfig: any) => {
      const entry = this.obstacleMap.get(obsConfig.name);
      if (entry) {
        this.activateObstacle(entry, obsConfig.initPosition, tableGroup);
      }
    });
  }

  private activateObstacle(
    entry: ObstacleEntry,
    initPosArray: [number, number, number],
    table: Group,
  ) {
    entry.state = "active";
    entry.mesh.visible = true;
    entry.body.setEnabled(true);

    const [x, y, z] = initPosArray;
    //entry.mesh.position.set(x, y, z); // local to table

    if (entry.body.isDynamic()) {
      this.scene.add(entry.mesh);
    } else {
      table.add(entry.mesh);
    }

    // Sync body to the mesh's initial world position
    // const worldPos = new Vector3();
    // entry.mesh.getWorldPosition(worldPos);
    // entry.body.setNextKinematicTranslation(worldPos);
  }

  private deactivateObstacle(entry: ObstacleEntry) {
    entry.state = "inactive";
    entry.mesh.visible = false;
    entry.body.setEnabled(false);

    // Move "under the floor" so it doesn't interfere
    entry.body.setNextKinematicTranslation({ x: 0, y: 0, z: 0 });
    this.scene.add(entry.mesh); // Move back to main scene so it doesn't tilt
  }

  // obstacle-system.ts
  // obstacle-system.ts

  update() {
    for (const obs of this.obstacles) {
      if (obs.state !== "active") continue;

      // If it's a dynamic capsule, it behaves like the ball:
      if (obs.body.isDynamic()) {
        const t = obs.body.translation();
        const r = obs.body.rotation();
        obs.mesh.position.set(t.x, t.y, t.z);
        obs.mesh.quaternion.set(r.x, r.y, r.z, r.w);
      } else {
        // Keep your existing Kinematic logic for Tube/Curved obstacles
        // because they should stay fixed to the table.
        if (!obs.mesh.parent) continue;
        obs.mesh.updateWorldMatrix(true, false);
        const worldPos = new Vector3();
        const worldQuat = new Quaternion();
        obs.mesh.getWorldPosition(worldPos);
        obs.mesh.getWorldQuaternion(worldQuat);

        obs.body.setNextKinematicTranslation(worldPos);
        obs.body.setNextKinematicRotation(worldQuat);
      }
    }
  }

  dispose() {
    this.obstacles.forEach((obs) => {
      if (obs.mesh.parent) obs.mesh.parent.remove(obs.mesh);
      this.physicsWorld.getWorld().removeRigidBody(obs.body);
    });
    this.obstacles = [];
    this.obstacleMap.clear();
  }
}
