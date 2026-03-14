import { formatTimePretty } from "@/lib/utils/time";
import { Vector3 } from "three";
import { gameEvents } from "..";
import { HoleName, LEVELS_CONFIG } from "../config";
import type { BallSystem } from "./ball-system";
import type { HoleSystem } from "./hole-system";
import type { ObstacleSystem } from "./obstacle-system";

import type { GameDisposable } from "@/games/types";

export class LevelSystem implements GameDisposable {
  private goals: HoleName[] = [];
  private currentLevel: number = 1;

  constructor(
    private ballSystem: BallSystem,
    private holeSystem: HoleSystem,
    private obstacleSystem: ObstacleSystem,
  ) {
    gameEvents.on("collision:goal", this.onGoal);
    gameEvents.on("collision:trap", this.onTrap);
    gameEvents.on("timer:updated", this.checkRemainingTime);
  }

  private onGoal = ({
    ballName,
    holeName,
    pos,
  }: {
    ballName: string;
    holeName: HoleName;
    pos: Vector3;
  }) => {
    const target = this.holeSystem.getCaptureTarget(holeName);
    if (!target) return;

    this.goals.push(holeName);
    this.ballSystem.captureBall(ballName, target);
    gameEvents.emit("fx:goal", pos);
    gameEvents.emit("score:add", 1);
    if (this.checkLevelGoals()) {
      gameEvents.emit("level:completed", { nextLevel: ++this.currentLevel });
    }
  };

  // New Trap Handler
  private onTrap = ({
    ballName,

    pos,
  }: {
    ballName: string;
    holeName: HoleName;
    pos: Vector3;
  }) => {
    gameEvents.emit("fx:trap", pos);

    this.ballSystem.destroyBall(ballName);

    setTimeout(() => {
      gameEvents.emit("level:failed");
    }, 1000);
  };

  private checkLevelGoals() {
    const success = LEVELS_CONFIG[this.currentLevel - 1].holes.goal.every((h) =>
      this.goals.includes(h),
    );
    return success;
  }

  private checkRemainingTime = (msElapsed: number) => {
    const timeLimit = LEVELS_CONFIG[this.currentLevel - 1].timeLimit;
    if (!timeLimit) return;
    const remainingTimeMs = timeLimit - msElapsed;

    gameEvents.emit("level:remaining-time", {
      prettyFormatted: formatTimePretty(remainingTimeMs),
      seconds: Math.max(Math.floor(remainingTimeMs / 1000), -1),
    });

    if (remainingTimeMs <= 0) {
      this.handleTimeUpFailure();
    }
  };

  reset(level: number) {
    this.currentLevel = level;
    this.goals = [];

    gameEvents.off("timer:updated", this.checkRemainingTime);
    gameEvents.on("timer:updated", this.checkRemainingTime);
  }

  private handleTimeUpFailure() {
    // Prevent multiple triggers if update keeps running
    gameEvents.off("timer:updated", this.checkRemainingTime);

    const activeBalls = this.ballSystem.getActiveBalls();

    // 1. Explode every ball currently on the table
    activeBalls.forEach((ball) => {
      const pos = new Vector3().copy(ball.mesh.position);
      gameEvents.emit("fx:trap", pos);
      this.ballSystem.destroyBall(ball.id);
    });

    // 2. Wait for the After Effects GIF/Sparkles to finish (e.g., 800ms - 1s)
    // this gives the "Juice" time to play out before the UI covers the screen
    setTimeout(() => {
      gameEvents.emit("level:failed");
    }, 1400);
  }

  dispose(): void {
    gameEvents.off("collision:goal", this.onGoal);
    gameEvents.off("collision:trap", this.onTrap);
    gameEvents.off("timer:updated", this.checkRemainingTime);

    // Clear internal state
    this.goals.length = 0;

    // Optional: break references for GC clarity
    // (not required, but helpful in long-lived SPAs)
    // @ts-expect-error intentional cleanup
    this.ballSystem = null;
    // @ts-expect-error intentional cleanup
    this.holeSystem = null;
  }
}
