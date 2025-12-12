import { useEffect, useState } from "react";

export function useDeviceTilt() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
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

      setTilt({ x: normX, y: normY });
    }

    window.addEventListener("click", requestIOSPermission, { once: true });
    window.addEventListener("deviceorientation", handleOrientation);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  return tilt;
}
