"use client";
import { IconMusicNote, IconMusicOff } from "@/components/ui/icons";
import { useAudioSession } from "@/store/audio-session";
import { useRef } from "react";

export function IntroAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { muted, toggleMuted } = useAudioSession();

  return (
    <div className="relative z-50 ">
      <button
        type="button"
        onPointerDown={() => {
          toggleMuted();
        }}
      >
        {muted ? <IconMusicOff /> : <IconMusicNote />}
      </button>

      <audio
        id="global-audio-player"
        ref={audioRef}
        preload="metadata"
        loop
        playsInline
        src="/assets/tahterevallis/audio/select-game-intro.wav"
      />
    </div>
  );
}
