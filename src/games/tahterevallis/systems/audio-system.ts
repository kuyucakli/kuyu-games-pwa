import { AssetManager } from "@/games/engine/assets/asset-manager";
import { gameEvents } from "..";
import { Vector3 } from "three";
import { AudioDirector } from "@/games/engine/audio/audio-director";
import { GameAssets } from "../config";

export class AudioSystem {
  constructor(
    private assets: AssetManager<typeof GameAssets>,
    private audio: AudioDirector
  ) {
    gameEvents.on("goal:entered", this.onGoal);
    gameEvents.on("audio:intro-home", this.onHomeIntro);
    gameEvents.on("audio:select-game", this.onSelectGame);

    //gameEvents.on("ball:hit-table", this.onBallHit);
  }

  private onHomeIntro = () => {
    this.audio.play(this.assets.get("homeIntroMusic"));
  };

  private onSelectGame = () => {
    this.audio.play(this.assets.get("homeIntroMusic"));
  };

  private onGoal = () => {
    this.audio.play(this.assets.get("goalSoundFx"));
  };

  private onBallHit = ({
    speed,
    position,
  }: {
    speed: number;
    position: Vector3;
  }) => {
    if (speed < 0.8) return;

    this.audio.playAt(this.assets.get("goalSoundFx"), position, undefined, {
      volume: Math.min(speed / 4, 1),
    });
  };

  dispose() {
    gameEvents.off("goal:entered", this.onGoal);
    //gameEvents.off("ball:hit-table", this.onBallHit);
  }
}
