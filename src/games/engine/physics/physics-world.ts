import { gameEvents } from "@/games/tahterevallis";
import RAPIER, { EventQueue } from "@dimforge/rapier3d";
import mitt from "mitt";
export type PhysicsWorldEvent = {
  "physics:collision": { c1: any; c2: any; started: boolean };
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

      gameEvents.emit("physics:collision", {
        c1,
        c2,
        started,
      });
      // const c1 = this.world.getCollider(h1);
      // const c2 = this.world.getCollider(h2);

      // if (!c1 || !c2) return;

      // const d1 = (c1 as any).userData;
      // const d2 = (c2 as any).userData;

      // const isBallHole =
      //   (d1?.type === "ball" && d2?.type === "hole") ||
      //   (d1?.type === "hole" && d2?.type === "ball");

      // if (!isBallHole) return;

      // const hole = d1?.type === "hole" ? d1.holeName : d2.holeName;

      // console.log("Ball entered hole:", hole);
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
