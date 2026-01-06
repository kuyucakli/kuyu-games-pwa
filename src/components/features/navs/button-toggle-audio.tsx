"use client";
import { threeAudioEngine } from "@/audio/three-audio-engine";
import { IconMusicNote, IconMusicOff } from "@/components/ui/icons";
import { useAudioSession } from "@/store/audio-session";
import buttonStyles from "../../ui/buttons/buttons.module.css";

export function ButtonToggleAudio() {
  const muted = useAudioSession((state) => state.muted);
  const setMuted = useAudioSession((state) => state.setMuted);

  return (
    <button
      type="button"
      onClick={async () => {
        await threeAudioEngine.unlock();
        threeAudioEngine.setMuted(!muted);
        setMuted(!muted);
      }}
      ref={(el) => {
        if (!el) return;
        el.addEventListener(
          "pointerdown",
          async () => {
            await threeAudioEngine.unlock();
            threeAudioEngine.setMuted(!muted);
            setMuted(!muted);
          },
          { once: true }
        );
      }}
      className={`${buttonStyles.ButtonRounded} ${
        muted ? "opacity-50" : ""
      } relative z-50`}
    >
      {muted ? <IconMusicOff /> : <IconMusicNote />}
    </button>
  );
}
