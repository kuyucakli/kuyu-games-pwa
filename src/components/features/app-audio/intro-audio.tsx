"use client";
import { IconMusicNote, IconMusicOff } from "@/components/ui/icons";
import { useAudioSession } from "@/store/audio-session";
import { useRef } from "react";

export function IntroAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { muted, setMuted } = useAudioSession();

  const handleUserGesture = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audio.paused) {
        await audio.play(); // queues if not ready
        setMuted(false);
      } else {
        audio.pause();
        setMuted(true);
      }
    } catch {
      // autoplay policy rejection
    }
  };

  return (
    <div className="relative z-50 ml-4">
      <button type="button" onPointerDown={handleUserGesture}>
        {muted ? <IconMusicOff /> : <IconMusicNote />}
      </button>

      <audio
        ref={audioRef}
        preload="metadata"
        loop
        playsInline
        src="/assets/tahterevallis/audio/select-game-intro.wav"
      />
    </div>
  );
}
