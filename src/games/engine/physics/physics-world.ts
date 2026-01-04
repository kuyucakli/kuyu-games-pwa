import { ColliderMeta } from "@/games/tahterevallis/types";
import RAPIER, { EventQueue } from "@dimforge/rapier3d";
import mitt from "mitt";
export type PhysicsWorldEvent = {
  "physics:collision": {
    a: ColliderMeta | undefined;
    b: ColliderMeta | undefined;
  };
  "physics:collisionEnd": {
    a: ColliderMeta | undefined;
    b: ColliderMeta | undefined;
  };
};
export const physicsWorldEvent = mitt<PhysicsWorldEvent>();

export class PhysicsWorld {
  private constructor(
    private readonly world: RAPIER.World,
    private readonly eventQueue: EventQueue,
    private colliderMetas = new Map<RAPIER.ColliderHandle, ColliderMeta>()
  ) {}

  static async create(): Promise<PhysicsWorld> {
    const RAPIER = await import("@dimforge/rapier3d");
    const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
    const eventQueue = new RAPIER.EventQueue(true);
    return new PhysicsWorld(world, eventQueue);
  }

  step(dt: number) {
    this.world.timestep = dt;
    this.world.step(this.eventQueue);

    this.eventQueue.drainCollisionEvents((h1, h2, started) => {
      // if (!started) return;
      const a = this.getColliderMeta(h1);
      const b = this.getColliderMeta(h2);

      if (!a || !b) return;

      if (started) {
        physicsWorldEvent.emit("physics:collision", { a, b });
      } else {
        physicsWorldEvent.emit("physics:collisionEnd", { a, b });
      }
    });
  }

  addColliderMeta(collider: RAPIER.Collider, data: ColliderMeta) {
    this.colliderMetas.set(collider.handle, data);
  }

  getColliderMeta(handle: RAPIER.ColliderHandle) {
    return this.colliderMetas.get(handle);
  }

  removeColliderMeta(collider: RAPIER.Collider) {
    this.colliderMetas.delete(collider.handle);
  }

  dispose() {
    if (this.world) {
      this.world.free();
    }
  }

  getWorld() {
    return this.world;
  }

  getEventQueue() {
    return this.eventQueue;
  }
}
