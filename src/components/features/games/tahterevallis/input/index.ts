import { Engine } from "../../engine/core/engine";
import * as THREE from "three";

export class TiltInput {
  x = 0;
  y = 0;

  attachMouseMove(engine: Engine) {
    window.addEventListener("mousemove", (e) => {
      const { w, h } = engine.viewport;
      this.x = (e.clientX / w) * 2 - 1;
      this.y = -((e.clientY / h) * 2 - 1);
    });
  }

  attachDeviceOrientation(isPortrait: () => boolean) {
    const D = DeviceOrientationEvent as any;

    if (typeof D?.requestPermission === "function") {
      window.addEventListener(
        "click",
        () => D.requestPermission().catch(() => {}),
        { once: true }
      );
    }

    window.addEventListener("deviceorientation", (e) => {
      let x = e.beta ?? 0;
      let y = e.gamma ?? 0;

      if (isPortrait()) {
        [x, y] = [y, -x];
      }

      this.x = THREE.MathUtils.clamp(x / 45, -1, 1);
      this.y = THREE.MathUtils.clamp(y / 45, -1, 1);
    });
  }
}
