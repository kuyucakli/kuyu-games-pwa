import { create } from "zustand";
import { persist } from "zustand/middleware";

type AudioSettings = {
  masterVolume: number;
  setMasterVolume: (v: number) => void;
};

export const useAudioPreferences = create<AudioSettings>()(
  persist(
    (set) => ({
      masterVolume: 1,
      setMasterVolume: (masterVolume) => set({ masterVolume }),
    }),
    { name: "audio-preferences" }
  )
);
