import { Vector3 } from "three";
import { gameEvents } from "..";
import { BallSystem } from "./ball-system";
import { HoleSystem } from "./hole-system";
import { HoleName, LEVELS_CONFIG } from "../config";

export class LevelSystem {
  private goals: HoleName[] = [];
  private currentLevel: number = 1;
  constructor(private ballSystem: BallSystem, private holeSystem: HoleSystem) {
    gameEvents.on("goal:entered", this.onGoal);
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
    if (this.checkLevel()) {
      gameEvents.emit("level:completed", { nextLevel: ++this.currentLevel });
    }
  };

  private checkLevel() {
    let success;
    success = LEVELS_CONFIG[this.currentLevel - 1].holes.goal.every((h) =>
      this.goals.includes(h)
    );
    return success;
  }
}
