import { Engine } from "../../engine/core/engine";

export class TiltInput {
  x = 0;
  y = 0;

  private active = false;

  attach(engine: Engine) {
    const el = engine.renderer.domElement;

    // ---------- Mouse ----------
    el.addEventListener("mousemove", (e) => {
      if (!this.active) return;
      this.setFromClient(e.clientX, e.clientY, el);
    });

    el.addEventListener("mousedown", () => {
      this.active = true;
    });

    el.addEventListener("mouseup", () => {
      this.active = false;
      this.x = 0;
      this.y = 0;
    });

    // ---------- Touch ----------
    el.addEventListener(
      "touchstart",
      (e) => {
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

  private setFromClient(clientX: number, clientY: number, el: HTMLElement) {
    const rect = el.getBoundingClientRect();

    // Normalize to -1 .. +1
    this.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.y = -(((clientY - rect.top) / rect.height) * 2 - 1);
  }
}

// import { Engine } from "../../engine/core/engine";
// import * as THREE from "three";

// export class TiltInput {
//   x = 0;
//   y = 0;

//   attachMouseMove(engine: Engine) {
//     window.addEventListener("mousemove", (e) => {
//       const { w, h } = engine.viewport;
//       this.x = (e.clientX / w) * 2 - 1;
//       this.y = -((e.clientY / h) * 2 - 1);
//     });
//   }

//   attachDeviceOrientation(isPortrait: () => boolean) {
//     const D = DeviceOrientationEvent as any;

//     if (typeof D?.requestPermission === "function") {
//       window.addEventListener(
//         "click",
//         () => D.requestPermission().catch(() => {}),
//         { once: true }
//       );
//     }

//     window.addEventListener("deviceorientation", (e) => {
//       let x = e.beta ?? 0;
//       let y = e.gamma ?? 0;

//       if (isPortrait()) {
//         [x, y] = [y, -x];
//       }

//       this.x = THREE.MathUtils.clamp(x / 45, -1, 1);
//       this.y = THREE.MathUtils.clamp(y / 45, -1, 1);
//     });
//   }
// }
