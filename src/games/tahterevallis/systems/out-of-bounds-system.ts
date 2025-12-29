import { gameEvents } from "..";
import { ActiveBallQuery } from "./ball-system";

export class OutOfBoundsSystem {
  private readonly Y_LIMIT = -2;
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
}
