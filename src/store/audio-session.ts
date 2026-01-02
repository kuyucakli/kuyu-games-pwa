// store/audio-session.ts
import { create } from "zustand";

type AudioSession = {
  muted: boolean;
  toggleMuted: () => void;
};

export const useAudioSession = create<AudioSession>((set, get) => ({
  muted: true,
  toggleMuted: async () => {
    const audio = document.getElementById(
      "global-audio-player"
    ) as HTMLAudioElement;

    if (!audio) return;

    try {
      if (audio.paused) {
        await audio.play(); // queues if not ready
        set({ muted: false });
      } else {
        audio.pause();
        set({ muted: true });
      }
    } catch {
      // autoplay policy rejection
    }
  },
}));
