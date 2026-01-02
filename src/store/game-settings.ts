// store/game-settings.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type TiltPermissionState = "unknown" | "granted" | "denied";

type GameSettings = {
  reducedMotion: boolean;
  language: string;
  tiltEnabled: boolean; // user preference (persisted)
  tiltPermission: TiltPermissionState; // runtime state

  setReducedMotion: (v: boolean) => void;
  setLanguage: (v: string) => void;
  setTiltEnabled: (v: boolean) => void;
  requestTiltPermission: () => Promise<void>;
};

export const useGameSettings = create<GameSettings>()(
  persist(
    (set, get) => ({
      reducedMotion: false,
      language: "en",
      tiltEnabled: false,
      tiltPermission: "unknown",
      setReducedMotion: (v) => set({ reducedMotion: v }),
      setLanguage: (v) => set({ language: v }),
      setTiltEnabled: (v) => set({ tiltEnabled: v }),
      requestTiltPermission: async () => {
        alert("slkmdsfldskf");
        if (!get().tiltEnabled) return;

        if (typeof window === "undefined") return;

        try {
          const DO = DeviceOrientationEvent as any;

          // iOS Safari
          if (typeof DO?.requestPermission === "function") {
            const result = await DO.requestPermission();
            set({
              tiltPermission: result === "granted" ? "granted" : "denied",
            });
            alert(result);
            if (result === "granted") set({ tiltEnabled: true });
            return;
          }

          // Android / Chrome / others (no permission prompt)
          if ("DeviceOrientationEvent" in window) {
            set({ tiltPermission: "granted" });
            set({ tiltEnabled: true });
            return;
          }

          set({ tiltPermission: "denied" });
        } catch {
          set({ tiltPermission: "denied" });
        }
      },
    }),

    { name: "game-settings" }
  )
);
