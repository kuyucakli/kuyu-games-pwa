"use client";
import { threeAudioEngine } from "@/audio/three-audio-engine";
import { IconMusicNote, IconMusicOff } from "@/components/ui/icons";
import { useAudioSession } from "@/store/audio-session";

export function ButtonToggleAudio() {
  const { muted, setMuted } = useAudioSession();

  return (
    <button
      type="button"
      onPointerDown={() => {
        threeAudioEngine.unlock();
        threeAudioEngine.setMuted(!muted);
        setMuted(!muted);
      }}
      className={`${muted ? "opacity-50" : ""} relative z-50`}
    >
      {muted ? <IconMusicOff /> : <IconMusicNote />}
    </button>
  );
}
