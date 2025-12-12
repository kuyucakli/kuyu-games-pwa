import { useEffect, useRef, useState } from "react";

export function useDeviceTilt() {
  const [tiltAngles, setTiltAngles] = useState([0, 0]);
  const needsUpdate = useRef(false);
  const pendingTiltAngles = useRef([0, 0]);

  useEffect(() => {
    let raf: number;
    function requestIOSPermission() {
      const D = DeviceOrientationEvent as any;

      if (typeof D?.requestPermission === "function") {
        D.requestPermission().catch(() => {});
      }
    }

    function handleOrientation(event: DeviceOrientationEvent) {
      const beta = event.beta ?? 0;
      const gamma = event.gamma ?? 0;

      const isPortrait = window.innerHeight > window.innerWidth;

      let x = beta;
      let y = gamma;

      if (isPortrait) {
        const rotatedX = y;
        const rotatedY = -x;
        x = rotatedX;
        y = rotatedY;
      }

      const normX = Math.max(-1, Math.min(1, x / 45));
      const normY = Math.max(-1, Math.min(1, y / 45));

      pendingTiltAngles.current = [normX, normY];
      needsUpdate.current = true;
    }

    function loop() {
      if (needsUpdate.current) {
        needsUpdate.current = false;
        setTiltAngles(pendingTiltAngles.current);
      }
      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);

    window.addEventListener("click", requestIOSPermission, { once: true });
    window.addEventListener("deviceorientation", handleOrientation);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
      cancelAnimationFrame(raf);
    };
  }, []);

  return tiltAngles;
}
