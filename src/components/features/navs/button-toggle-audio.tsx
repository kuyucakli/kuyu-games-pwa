"use client";
import { threeAudioEngine } from "@/audio/three-audio-engine";
import { IconMusicNote, IconMusicOff } from "@/components/ui/icons";
import { useAudioSession } from "@/store/audio-session";
import buttonStyles from "../../ui/buttons/buttons.module.css";
import { ButtonRounded } from "@/components/ui/buttons";

export function ButtonToggleAudio() {
  const muted = useAudioSession((state) => state.muted);
  const setMuted = useAudioSession((state) => state.setMuted);

  return (
    <ButtonRounded
      type="button"
      onClick={async () => {
        await threeAudioEngine.unlock();
        threeAudioEngine.setMuted(!muted);
        setMuted(!muted);
      }}
      className={`${buttonStyles.ButtonRounded} ${
        muted ? "opacity-100" : ""
      } relative z-50`}
    >
      {muted ? <IconMusicOff size="20px" /> : <IconMusicNote size="20px" />}
    </ButtonRounded>
  );
}
