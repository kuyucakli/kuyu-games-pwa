import RAPIER from "@dimforge/rapier3d";
import { Vector3 } from "three";
export class PhysicsWorld {
  private constructor(private readonly world: RAPIER.World) {}

  static async create(): Promise<PhysicsWorld> {
    const RAPIER = await import("@dimforge/rapier3d");
    const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
    return new PhysicsWorld(world);
  }

  step(dt: number) {
    this.world.timestep = dt;
    this.world.step();
  }

  dispose() {
    if (this.world) {
      this.world.free();
    }
  }

  getWorld() {
    return this.world;
  }

  createDynamicBall(radius: number, position: [number, number, number]) {
    const body = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic().setTranslation(...position)
    );

    const collider = this.world.createCollider(
      RAPIER.ColliderDesc.ball(radius)
        .setMass(1)
        .setRestitution(0.5)
        .setFriction(0.8),
      body
    );

    return { body, collider };
  }

  createKinematicTrimesh(
    vertices: Float32Array,
    indices: Uint32Array,
    position: Vector3
  ): RAPIER.RigidBody {
    // const { vertices, indices } = model.getColliderTrimeshLocal();

    const body = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(
        position.x,
        position.y,
        position.z
      )
    );

    const collider = RAPIER.ColliderDesc.trimesh(vertices, indices)
      .setFriction(1)
      .setRestitution(0.2);

    this.world.createCollider(collider, body);
    return body;
  }
}
