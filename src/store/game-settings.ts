// store/game-settings.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type GameSettings = {
  reducedMotion: boolean;
  language: string;
  setReducedMotion: (v: boolean) => void;
  setLanguage: (v: string) => void;
};

export const useGameSettings = create<GameSettings>()(
  persist(
    (set) => ({
      reducedMotion: false,
      language: "en",
      setReducedMotion: (v) => set({ reducedMotion: v }),
      setLanguage: (v) => set({ language: v }),
    }),
    { name: "game-settings" }
  )
);
