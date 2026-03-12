import * as THREE from "three";
import { Vector2 } from "three";

import { gameEvents } from "..";
import { createExplosionSprite } from "../factories/sprite-factory";

export class BallExplosionSpriteSystem {
  container: THREE.Object3D;
  private sprite: THREE.Sprite;
  private isPlaying = false;
  private currentFrame = 0;
  private timer = 0;

  private readonly GRID = new Vector2(8, 4); // 2048x1024 export
  private readonly FPS = 30;

  constructor(texture: THREE.Texture) {
    this.container = new THREE.Object3D();
    this.sprite = createExplosionSprite(texture, this.GRID);
    this.container.add(this.sprite);

    gameEvents.on("fx:trap", this.onTrapFx);
  }

  private onTrapFx = (pos: THREE.Vector3) => {
    this.play(pos);
  };

  play(position: THREE.Vector3, scale: number = 5.2) {
    this.sprite.position.copy(position);
    this.sprite.scale.set(scale, scale, 1);
    this.sprite.rotation.z = Math.random() * Math.PI * 2;

    this.sprite.visible = true;
    this.currentFrame = 0;
    this.timer = 0;
    this.isPlaying = true;
  }

  update(delta: number) {
    if (!this.isPlaying) return;

    this.timer += delta;
    if (this.timer >= 1 / this.FPS) {
      this.timer = 0;
      this.currentFrame++;

      const totalFrames = this.GRID.x * this.GRID.y;

      if (this.currentFrame >= totalFrames) {
        this.stop();
      } else {
        const col = this.currentFrame % this.GRID.x;
        const row = Math.floor(this.currentFrame / this.GRID.x);

        // UV calculation
        this.sprite.material.map!.offset.set(
          col / this.GRID.x,
          1 - (row + 1) / this.GRID.y,
        );
      }
    }
  }

  private stop() {
    this.isPlaying = false;
    this.sprite.visible = false;
  }

  dispose() {
    gameEvents.off("fx:trap", this.onTrapFx);
    this.sprite.material.map?.dispose();
    this.sprite.material.dispose();
  }
}
