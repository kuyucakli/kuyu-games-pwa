import { AudioListener } from "three";

class ThreeAudioEngine {
  readonly id = Math.random().toString(36).slice(2);
  private _listener: AudioListener | null = null;
  private _masterGain: GainNode | null = null;
  private _lastVolume = 1;
  unlocked = false;

  private createListener(): AudioListener {
    if (typeof window === "undefined") {
      throw new Error("AudioListener accessed on the server");
    }

    if (!this._listener) {
      this._listener = new AudioListener();
      this.ensureGraph(this._listener);
    }

    return this._listener;
  }

  private ensureGraph(listener: AudioListener) {
    if (this._masterGain) return;

    const ctx = listener.context;

    this._masterGain = ctx.createGain();
    this._masterGain.gain.value = this._lastVolume;
    this._masterGain.connect(ctx.destination);

    // Re-route Three.js internal output → master gain
    const listenerGain = (listener as any).gain;
    listenerGain.disconnect();
    listenerGain.connect(this._masterGain);
  }

  get listener(): AudioListener {
    return this.createListener();
  }

  /** Global audio exit point */
  get output(): GainNode {
    if (!this._masterGain) {
      this.listener; // force init
    }
    return this._masterGain!;
  }

  async unlock() {
    if (typeof window === "undefined") return;
    if (this.unlocked) return;

    await this.listener.context.resume();
    this.unlocked = true;
  }

  setMasterVolume(v: number) {
    if (!this._masterGain) {
      this.listener; // force init
    }

    const clamped = Math.max(0, Math.min(1, v));
    this._lastVolume = clamped;
    this._masterGain!.gain.value = clamped;
  }

  setMuted(muted: boolean) {
    if (!this._masterGain) return;

    if (muted) {
      this._lastVolume = this._masterGain.gain.value;
      this._masterGain.gain.value = 0;
    } else {
      this._masterGain.gain.value = this._lastVolume;
    }
  }
}

export const threeAudioEngine = new ThreeAudioEngine();
