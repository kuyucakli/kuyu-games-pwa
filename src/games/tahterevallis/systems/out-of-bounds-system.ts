import { GameDisposable } from "@/games/types";
import { gameEvents } from "..";
import { ActiveBallQuery } from "./ball-system";
import { physicsWorldEvent } from "@/games/engine/physics/physics-world";

export class OutOfBoundsSystem implements GameDisposable {
  private readonly Y_LIMIT = -3.4;
  private reported = new Set<string>();

  constructor(private ballQuery: ActiveBallQuery) {}

  update() {
    for (const ball of this.ballQuery.getActiveBalls()) {
      if (this.reported.has(ball.id)) continue;
      if (ball.body.translation().y < this.Y_LIMIT) {
        this.reported.add(ball.id);
        gameEvents.emit("ball:out-of-bounds", {
          ballId: ball.id,
        });
      }
    }
  }

  reset() {
    this.reported.clear();
  }

  dispose(): void {
    this.reported.clear();

    // Optional: break reference to help GC in long-lived apps
    // @ts-expect-error intentional cleanup
    this.ballQuery = null;
  }
}
