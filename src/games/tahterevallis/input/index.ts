import { Engine } from "../../engine/core/engine";

export class TiltInput {
  x = 0;
  y = 0;

  private active = false;
  private isTouch = false;
  private useDeviceTilt = false;

  // --- tuning ---
  private DEAD_ZONE_TILT = 2; // degrees
  private PHYSICAL_MAX_TILT = 45; // absolute safety clamp

  private CONTROL_RANGE_X = 15; // left / right feels weaker
  private CONTROL_RANGE_Y = 18; // forward / back feels stronger

  // --- calibration ---
  private zeroX = 0;
  private zeroY = 0;
  private calibrated = false;

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

    el.addEventListener("pointerup", () => this.reset());
    el.addEventListener("pointercancel", () => this.reset());

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

    this.enableDeviceTilt();
  }

  reset() {
    this.active = false;
    this.x = 0;
    this.y = 0;
  }

  // ---------- Pointer / touch mapping ----------
  private setFromClient(clientX: number, clientY: number, el: HTMLElement) {
    const rect = el.getBoundingClientRect();

    this.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    let y = ((clientY - rect.top) / rect.height) * 2 - 1;
    this.y = -y; // screen → game space
  }

  // ---------- Axis-aware normalization ----------
  private normalizeTilt(deg: number, controlRange: number): number {
    const abs = Math.abs(deg);
    if (abs < this.DEAD_ZONE_TILT) return 0;

    const clamped = Math.min(abs, this.PHYSICAL_MAX_TILT);
    const t = Math.min(clamped / controlRange, 1);

    // smoothstep curve
    // const curved = t * t * (3 - 2 * t);
    const curved = Math.pow(t, 1.3);
    return Math.sign(deg) * curved;
  }

  private calibrate(rawX: number, rawY: number) {
    this.zeroX = rawX;
    this.zeroY = rawY;
    this.calibrated = true;
  }

  // ---------- Device tilt ----------
  private enableDeviceTilt() {
    this.useDeviceTilt = true;

    window.addEventListener("deviceorientation", (e) => {
      if (this.active) return;
      if (e.beta == null || e.gamma == null) return;

      const beta = e.beta; // front / back
      const gamma = e.gamma; // left / right

      const angle =
        screen.orientation?.angle ?? (window as any).orientation ?? 0;

      let rawX = 0;
      let rawY = 0;

      // Convert device space → world space
      switch (angle) {
        case 0: // portrait
          rawX = -gamma;
          rawY = beta;
          break;

        case 90: // landscape right
          rawX = beta;
          rawY = gamma;
          break;

        case -90:
        case 270: // landscape left
          rawX = -beta;
          rawY = -gamma;
          break;

        case 180: // upside-down portrait
          rawX = gamma;
          rawY = -beta;
          break;
      }

      // First valid reading becomes neutral
      if (!this.calibrated) {
        this.calibrate(rawX, rawY);
        this.x = 0;
        this.y = 0;
        return;
      }

      const relX = rawX - this.zeroX;
      const relY = rawY - this.zeroY;

      this.x = this.normalizeTilt(relX, this.CONTROL_RANGE_X);
      this.y = this.normalizeTilt(relY, this.CONTROL_RANGE_Y);
    });
  }
}
// import { Engine } from "../../engine/core/engine";

// export class TiltInput {
//   x = 0;
//   y = 0;

//   private active = false;
//   private isTouch = false;
//   private useDeviceTilt = false;
//   private DEAD_ZONE_TILT = 2; // degrees
//   private PHYSICAL_MAX_TILT = 45; // degrees (user can tilt a lot)
//   private CONTROL_RANGE_TILT = 15; // degrees (full input already reached)
//   private CONTROL_RANGE_X = 10; // degrees
//   private CONTROL_RANGE_Y = 18; // degrees
//   private zeroX = 0;
//   private zeroY = 0;
//   private calibrated = false;

//   attach(engine: Engine) {
//     const el = engine.renderer.domElement;

//     // ---------- Mouse ----------
//     el.addEventListener("mousemove", (e) => {
//       if (!this.active) return;
//       this.setFromClient(e.clientX, e.clientY, el);
//     });

//     el.addEventListener("pointerdown", (e) => {
//       el.setPointerCapture(e.pointerId);
//       this.isTouch = false;
//       this.active = true;
//     });

//     el.addEventListener("pointerup", () => {
//       this.reset();
//     });

//     el.addEventListener("pointercancel", () => {
//       this.reset();
//     });

//     // ---------- Touch ----------
//     el.addEventListener(
//       "touchstart",
//       (e) => {
//         this.isTouch = true;
//         this.active = true;
//         const t = e.touches[0];
//         this.setFromClient(t.clientX, t.clientY, el);
//       },
//       { passive: true }
//     );

//     el.addEventListener(
//       "touchmove",
//       (e) => {
//         if (!this.active) return;
//         const t = e.touches[0];
//         this.setFromClient(t.clientX, t.clientY, el);
//       },
//       { passive: true }
//     );

//     el.addEventListener(
//       "touchend",
//       () => {
//         this.active = false;
//         this.x = 0;
//         this.y = 0;
//       },
//       { passive: true }
//     );

//     this.enableDeviceTilt();
//   }

//   reset() {
//     this.active = false;
//     this.x = 0;
//     this.y = 0;
//   }

//   private setFromClient(clientX: number, clientY: number, el: HTMLElement) {
//     const rect = el.getBoundingClientRect();

//     // Normalize to -1 .. +1
//     this.x = ((clientX - rect.left) / rect.width) * 2 - 1;
//     let y = ((clientY - rect.top) / rect.height) * 2 - 1;
//     y = -y; // screen → game space

//     this.y = y;
//     // this.y = this.isTouch ? -y : y;
//   }

//   private normalizeTilt(deg: number): number {
//     const abs = Math.abs(deg);

//     if (abs < this.DEAD_ZONE_TILT) return 0;

//     // Clamp to physical safety limit
//     const clamped = Math.min(abs, this.PHYSICAL_MAX_TILT);

//     // Map CONTROL range to full input
//     const t = Math.min(clamped / this.CONTROL_RANGE_TILT, 1);

//     // Curve: fast response, stable center
//     const curved = t * t * (3 - 2 * t); // smoothstep

//     return Math.sign(deg) * curved;
//   }

//   private calibrate(rawX: number, rawY: number) {
//     this.zeroX = rawX;
//     this.zeroY = rawY;
//     this.calibrated = true;
//   }

//   private enableDeviceTilt() {
//     this.useDeviceTilt = true;

//     window.addEventListener("deviceorientation", (e) => {
//       if (this.active) return;
//       if (e.beta == null || e.gamma == null) return;

//       const beta = e.beta;
//       const gamma = e.gamma;

//       const angle =
//         screen.orientation?.angle ?? (window as any).orientation ?? 0;

//       let rawX = 0;
//       let rawY = 0;

//       switch (angle) {
//         case 0: // portrait
//           rawX = -gamma;
//           rawY = beta;
//           break;

//         case 90: // landscape right (home button on the right)
//           rawX = beta;
//           rawY = gamma;
//           break;

//         case -90:
//         case 270: // landscape left
//           rawX = -beta;
//           rawY = -gamma;
//           break;

//         case 180: // upside-down portrait
//           rawX = gamma;
//           rawY = -beta;
//           break;
//       }

//       if (!this.calibrated) {
//         this.calibrate(rawX, rawY);
//         this.x = 0;
//         this.y = 0;
//         return;
//       }

//       const relX = rawX - this.zeroX;
//       const relY = rawY - this.zeroY;

//       this.x = this.normalizeTilt(relX);
//       this.y = this.normalizeTilt(relY);
//     });
//   }
// }
