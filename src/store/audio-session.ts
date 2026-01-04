// store/audio-session.ts
import { create } from "zustand";

type AudioSession = {
  muted: boolean;
  setMuted: (muted: boolean) => void;
};

export const useAudioSession = create<AudioSession>((set, get) => ({
  muted: true,
  setMuted: (muted) => {
    set({ muted });
  },
}));
