"use client";

import { useEffect, useState } from "react";
import { appAudioManager } from "@/audio/app-audio-manager";
import { threeAudioEngine } from "@/audio/three-audio-engine";
import { Progress } from "@/components/ui/progress";
import { useAudioSession } from "@/store/audio-session";
import styles from "./select-game-intro.module.css";
import { VideoMovieIntros } from "./video-movie-intros";

export function SelectGameIntro({
  exit = false,
  onExit,
}: {
  exit: boolean;
  onExit: () => void;
}) {
  const muted = useAudioSession((state) => state.muted);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  // 1. Load + unlock ONCE
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const ctx = threeAudioEngine.listener.context;

      await appAudioManager.load(
        "select-game",
        "/assets/tahterevallis/audio/select-game-intro.wav",
        ctx,
        (percent) => {
          if (!cancelled) {
            setProgress(percent); // Update the bar as it loads
          }
        },
      );

      if (!cancelled) {
        setReady(true);
      }
    })();

    return () => {
      cancelled = true;
      appAudioManager.setVolumeSmooth(0.008);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    if (muted) {
      appAudioManager.stop();
    } else {
      appAudioManager.playLoop(
        "select-game",
        threeAudioEngine.output,
        0.0,
        2.0,
      );
      appAudioManager.setVolumeSmooth(0.09);
    }
  }, [muted, ready]);

  return (
    <div
      className={`${styles.SelectGameIntro} ${exit ? styles.Exit : ""} bg-[url(/assets/tahterevallis/images/bg-select-game.jpg)] bg-cover bg-center bg-no-repeat `}
      onAnimationEnd={() => onExit()}
    >
      {!ready && (
        <div className="p-1">
          <Progress value={progress} id="load-audio" />
          <span className="text-xs">Loading audio...</span>
        </div>
      )}
      <VideoMovieIntros />
    </div>
  );
}
