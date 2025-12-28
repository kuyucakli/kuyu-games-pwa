// store/audio-session.ts
import { create } from "zustand";

type AudioSession = {
  muted: boolean;
  unlocked: boolean;
  setMuted: (v: boolean) => void;
  unlock: () => void;
};

export const useAudioSession = create<AudioSession>((set) => ({
  muted: true,
  unlocked: false,
  setMuted: (muted) => set({ muted }),
  unlock: () => set({ unlocked: true }),
}));
