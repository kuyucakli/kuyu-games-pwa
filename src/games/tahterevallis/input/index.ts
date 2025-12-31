import { Engine } from "../../engine/core/engine";

export class TiltInput {
  x = 0;
  y = 0;

  private active = false;
  private isTouch = false;

  attach(engine: Engine) {
    const el = engine.renderer.domElement;

    // ---------- Mouse ----------
    el.addEventListener("mousemove", (e) => {
      if (!this.active) return;
      this.setFromClient(e.clientX, e.clientY, el);
    });

    el.addEventListener("pointerdown", (e) => {
      el.setPointerCapture(e.pointerId);
      this.isTouch = false;
      this.active = true;
    });

    el.addEventListener("pointerup", () => {
      this.reset();
    });

    el.addEventListener("pointercancel", () => {
      this.reset();
    });

    // ---------- Touch ----------
    el.addEventListener(
      "touchstart",
      (e) => {
        this.isTouch = true;
        this.active = true;
        const t = e.touches[0];
        this.setFromClient(t.clientX, t.clientY, el);
      },
      { passive: true }
    );

    el.addEventListener(
      "touchmove",
      (e) => {
        if (!this.active) return;
        const t = e.touches[0];
        this.setFromClient(t.clientX, t.clientY, el);
      },
      { passive: true }
    );

    el.addEventListener(
      "touchend",
      () => {
        this.active = false;
        this.x = 0;
        this.y = 0;
      },
      { passive: true }
    );
  }

  reset() {
    this.active = false;
    this.x = 0;
    this.y = 0;
  }

  private setFromClient(clientX: number, clientY: number, el: HTMLElement) {
    const rect = el.getBoundingClientRect();

    // Normalize to -1 .. +1
    this.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    let y = ((clientY - rect.top) / rect.height) * 2 - 1;
    y = -y; // screen → game space

    this.y = this.isTouch ? -y : y;
  }
}
