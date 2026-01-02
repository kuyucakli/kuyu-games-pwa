import { Vector3 } from "three";
import { gameEvents } from "..";
import { BallSystem } from "./ball-system";
import { HoleSystem } from "./hole-system";
import { HoleName, LEVELS_CONFIG } from "../config";
import { formatTimePretty } from "@/lib/utils/time";
import { GameDisposable } from "@/games/types";

export class LevelSystem implements GameDisposable {
  private goals: HoleName[] = [];
  private currentLevel: number = 1;
  constructor(private ballSystem: BallSystem, private holeSystem: HoleSystem) {
    gameEvents.on("goal:entered", this.onGoal);
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

  private checkLevelGoals() {
    let success;
    success = LEVELS_CONFIG[this.currentLevel - 1].holes.goal.every((h) =>
      this.goals.includes(h)
    );
    return success;
  }

  private checkRemainingTime = (msElapsed: number) => {
    const timeLimit = LEVELS_CONFIG[this.currentLevel - 1].timeLimit;
    if (!timeLimit) return;
    const remainingTimeMs = timeLimit - msElapsed;
    if (remainingTimeMs <= 0) {
      gameEvents.emit("level:failed");
    }
    gameEvents.emit("level:remaining-time", {
      prettyFormatted: formatTimePretty(remainingTimeMs),
      seconds: Math.max(Math.floor(remainingTimeMs / 1000), 0),
    });
  };

  reset(level: number) {
    this.currentLevel = level;
    this.goals = [];
  }

  dispose(): void {
    gameEvents.off("goal:entered", this.onGoal);
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
