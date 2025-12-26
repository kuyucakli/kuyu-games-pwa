import { gameEvents } from "..";

export class TimerSystem {
  private elapsed: number = 0;
  private running = false;

  start() {
    this.elapsed = 0;
    this.running = true;
  }

  stop() {
    this.running = false;
  }

  update(dt: number) {
    if (!this.running) return;
    this.elapsed += dt;
    gameEvents.emit("timer:updated", this.getPrettyElapsed());
  }

  getPrettyElapsed() {
    return this.getFormatted();
  }

  getFormatted() {
    const ms = Math.floor((this.elapsed % 1) * 1000);
    const s = Math.floor(this.elapsed) % 60;
    const m = Math.floor(this.elapsed / 60);

    return `${m}:${s.toString().padStart(2, "0")}.${Math.floor(ms / 100)}`;
  }
}
