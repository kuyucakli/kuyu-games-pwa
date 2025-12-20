import { gameEvents } from "@/games/tahterevallis";
import RAPIER, { Collider, EventQueue } from "@dimforge/rapier3d";
import mitt from "mitt";
export type PhysicsWorldEvent = {
  "physics:collision": { c1: Collider; c2: Collider; started: boolean };
};
export const physicsWorldEvent = mitt<PhysicsWorldEvent>();

export class PhysicsWorld {
  private constructor(
    private readonly world: RAPIER.World,
    private readonly eventQueue: EventQueue
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
      if (!started) return;
      const c1 = this.world.getCollider(h1);
      const c2 = this.world.getCollider(h2);

      if (!c1 || !c2) return;

      physicsWorldEvent.emit("physics:collision", {
        c1,
        c2,
        started,
      });
    });
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
