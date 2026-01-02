import { MathUtils } from "three";
import { Engine } from "../../engine/core/engine";

export class TiltInput {
  x = 0;
  y = 0;

  private active = false;
  private isTouch = false;
  private useDeviceTilt = false;
  private DEAD_ZONE_TILT = 2; // degrees
  private MAX_TILT = 20; // degrees

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

    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      // iOS requires permission
      const maybeRequestPermission = async () => {
        alert("aa");
        const deviceOrientation = DeviceOrientationEvent as any;
        if (typeof deviceOrientation.requestPermission === "function") {
          const result = await deviceOrientation.requestPermission();
          if (result === "granted") {
            this.enableDeviceTilt();
          }
        } else {
          // Android / others
          this.enableDeviceTilt();
        }
      };

      // Call this from a user gesture (e.g. first touch)
      el.addEventListener("pointerdown", maybeRequestPermission, {
        once: true,
      });
    }
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

    this.y = y;
    // this.y = this.isTouch ? -y : y;
  }

  private normalizeTilt(deg: number): number {
    const abs = Math.abs(deg);

    if (abs < this.DEAD_ZONE_TILT) return 0;

    const t = Math.min(abs, this.MAX_TILT) / this.MAX_TILT;

    // smoothstep-like curve (good control near center)
    const curved = t * t * (3 - 2 * t);

    return Math.sign(deg) * curved;
  }

  private enableDeviceTilt() {
    this.useDeviceTilt = true;

    window.addEventListener("deviceorientation", (e) => {
      if (this.active) return;
      if (e.beta == null || e.gamma == null) return;

      const beta = e.beta;
      const gamma = e.gamma;

      const angle =
        screen.orientation?.angle ?? (window as any).orientation ?? 0;

      let rawX = 0;
      let rawY = 0;

      switch (angle) {
        case 0:
          rawX = gamma;
          rawY = beta;
          break;

        case 90:
          rawX = beta;
          rawY = -gamma;
          break;

        case -90:
        case 270:
          rawX = -beta;
          rawY = gamma;
          break;

        case 180:
          rawX = -gamma;
          rawY = -beta;
          break;
      }

      this.x = this.normalizeTilt(rawX);
      this.y = this.normalizeTilt(rawY);
    });
  }

  // private enableDeviceTilt() {
  //   this.useDeviceTilt = true;

  //   window.addEventListener("deviceorientation", (e) => {
  //     if (this.active) return; // touch/mouse takes priority
  //     if (e.beta == null || e.gamma == null) return;

  //     // Normalize
  //     const x = MathUtils.clamp(e.gamma / 45, -1, 1);
  //     const y = MathUtils.clamp(e.beta / 45, -1, 1);

  //     // tilt device forward → table top moves away
  //     this.x = -x;
  //     this.y = y;
  //   });
  // }
}
