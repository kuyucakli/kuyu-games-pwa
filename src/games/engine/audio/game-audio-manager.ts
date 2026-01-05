// game/audio/audio-director.ts
import { Audio, PositionalAudio, Object3D, Vector3, Camera } from "three";
import { threeAudioEngine } from "@/audio/three-audio-engine";

export class GameAudioManager {
  private camera?: Camera;

  attachCamera(camera: Camera) {
    if (this.camera === camera) return;
    this.camera?.remove(threeAudioEngine.listener);
    this.camera = camera;
    camera.add(threeAudioEngine.listener);
  }

  play(buffer: AudioBuffer, opts?: { volume?: number; playbackRate?: number }) {
    if (!threeAudioEngine.unlocked) return;

    const audio = new Audio(threeAudioEngine.listener);
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
    if (!this.camera || !threeAudioEngine.unlocked) return;

    const audio = new PositionalAudio(threeAudioEngine.listener);
    audio.setBuffer(buffer);
    audio.setRefDistance(1);
    audio.setVolume(opts?.volume ?? 1);

    (parent ?? this.camera).add(audio);
    audio.position.copy(position);
    audio.play();

    audio.onEnded = () => audio.removeFromParent();
  }

  get output(): AudioNode {
    return threeAudioEngine.listener.getInput();
  }
}
