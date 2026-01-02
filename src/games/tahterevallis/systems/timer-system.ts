import { GameDisposable } from "@/games/types";
import { gameEvents } from "..";

export class TimerSystem implements GameDisposable {
  private elapsed: number = 0;
  private running = false;

  start() {
    this.elapsed = 0;
    this.running = true;
  }

  stop() {
    this.running = false;
  }

  pause() {
    this.running = false;
  }

  resume() {
    if (this.running) return;
    this.running = true;
  }

  update(dtSeconds: number) {
    if (!this.running) return;

    const dtMs = dtSeconds * 1000;
    this.elapsed += dtMs;

    gameEvents.emit("timer:updated", this.elapsed);
  }

  dispose(): void {
    this.running = false;
    this.elapsed = 0;
  }
}
