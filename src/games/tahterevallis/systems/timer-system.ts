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

  update(dtSeconds: number) {
    if (!this.running) return;

    const dtMs = dtSeconds * 1000;
    this.elapsed += dtMs;

    gameEvents.emit("timer:updated", this.elapsed);
  }
}
