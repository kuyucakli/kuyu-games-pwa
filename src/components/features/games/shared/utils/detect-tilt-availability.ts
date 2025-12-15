export function detectTiltAvailability(): Promise<boolean> {
  return new Promise((resolve) => {
    console.log(DeviceOrientationEvent, "****???");
    if (typeof DeviceOrientationEvent === "undefined") {
      console.log(DeviceOrientationEvent);

      resolve(false);
      return;
    }

    let received = false;

    function handler(event: DeviceOrientationEvent) {
      const hasRealData =
        event.beta !== null || event.gamma !== null || event.alpha !== null;

      if (hasRealData) {
        received = true;
        window.removeEventListener("deviceorientation", handler);
        resolve(true);
      }
    }

    window.addEventListener("deviceorientation", handler, { once: true });

    setTimeout(() => {
      if (!received) {
        resolve(false);
      }
    }, 300);
  });
}
