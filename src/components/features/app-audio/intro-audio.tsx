"use client";
import { IconMusicNote, IconMusicOff } from "@/components/ui/icons";
import { useAudioSession } from "@/store/audio-session";
import { useGameSettings } from "@/store/game-settings";
import { useEffect, useRef, useState } from "react";

export function IntroAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [ready, setReady] = useState(false);
  const { muted, setMuted } = useAudioSession((state) => state);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onReady = () => setReady(true);

    audio.addEventListener("canplaythrough", onReady);

    if (audio.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
      setReady(true);
    }

    return () => {
      audio.removeEventListener("canplaythrough", onReady);
    };
  }, []);

  const handleUserGesture = async () => {
    if (!audioRef.current || !ready) return;

    try {
      if (muted) {
        audioRef.current.load();
        await audioRef.current.play();
        setMuted(false);
      } else {
        audioRef.current.pause();
        setMuted(true);
      }
    } catch (err) {
      // autoplay policy rejection ends up here
    }
  };

  return (
    <div className="relative z-50 ml-4">
      <button
        type="button"
        onClick={handleUserGesture}
        className="block"
        disabled={!ready}
      >
        {muted ? <IconMusicOff /> : <IconMusicNote />}
        {ready ? "ready" : "not ready"}
      </button>
      <audio
        ref={audioRef}
        preload="auto"
        loop
        autoPlay={!muted}
        onLoadedMetadata={() => setReady(true)}
        src="/assets/tahterevallis/audio/select-game-intro.wav"
      />
    </div>
  );
}
