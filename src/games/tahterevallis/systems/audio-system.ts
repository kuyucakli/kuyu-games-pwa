import { AssetManager } from "@/games/engine/assets/asset-manager";
import { gameEvents } from "..";
import { GameAudioManager } from "@/games/engine/audio/game-audio-manager";
import { GameAssets } from "../config";
import { GameDisposable } from "@/games/types";
import { BallRollingAudio } from "../objects/ball";

export class AudioSystem implements GameDisposable {
  constructor(
    private assets: AssetManager<typeof GameAssets>,
    private audio: GameAudioManager,
  ) {
    gameEvents.on("collision:goal", this.onGoal);
    gameEvents.on("collision:trap", this.onBallTrapped);
    gameEvents.on("audio:intro-home", this.onHomeIntro);
    gameEvents.on("audio:select-game", this.onSelectGame);

    //gameEvents.on("ball:hit-table", this.onBallHit);
  }

  private onHomeIntro = () => {
    this.audio.play(this.assets.get("homeIntroMusic"), { volume: 0.01 });
  };

  private onSelectGame = () => {
    this.audio.play(this.assets.get("homeIntroMusic"), { volume: 0.01 });
  };

  private onGoal = () => {
    this.audio.play(this.assets.get("goalSoundFx"), { volume: 0.001 });
  };
  private onBallTrapped = () => {
    this.audio.play(this.assets.get("ballExplosionFx"), { volume: 0.05 });
  };

  createBallRollingAudio(): BallRollingAudio {
    return new BallRollingAudio(
      this.assets.get("ballRollingSoundFx"),
      this.audio.output,
    );
  }

  dispose(): void {
    gameEvents.off("collision:goal", this.onGoal);
    gameEvents.off("audio:intro-home", this.onHomeIntro);
    gameEvents.off("audio:select-game", this.onSelectGame);
    //gameEvents.off("ball:hit-table", this.onBallHit);
  }
}
