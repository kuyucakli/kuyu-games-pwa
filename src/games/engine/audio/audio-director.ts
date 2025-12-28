import {
  AudioListener,
  Audio,
  PositionalAudio,
  Object3D,
  Vector3,
  Camera,
} from "three";

export class AudioDirector {
  private listener = new AudioListener();
  private unlocked = false;
  private camera?: Camera;

  attachCamera(camera: Camera) {
    if (this.camera === camera) return;

    if (this.camera) {
      this.camera.remove(this.listener);
    }

    this.camera = camera;
    this.camera.add(this.listener);
  }

  get context() {
    return this.listener.context;
  }

  unlock() {
    if (this.unlocked) return;
    this.listener.context.resume();
    this.unlocked = true;
  }

  play(buffer: AudioBuffer, opts?: { volume?: number; playbackRate?: number }) {
    const audio = new Audio(this.listener);
    audio.setBuffer(buffer);
    audio.setVolume(opts?.volume ?? 1);
    audio.setPlaybackRate(opts?.playbackRate ?? 1);
    audio.play();
  }

  playAt(
    buffer: AudioBuffer,
    position: Vector3,
    parent?: Object3D,
    opts?: { volume?: number }
  ) {
    if (!this.camera) return;

    const audio = new PositionalAudio(this.listener);
    audio.setBuffer(buffer);
    audio.setRefDistance(1);
    audio.setVolume(opts?.volume ?? 1);

    (parent ?? this.camera).add(audio);
    audio.position.copy(position);
    audio.play();

    audio.onEnded = () => audio.removeFromParent();
  }
}
