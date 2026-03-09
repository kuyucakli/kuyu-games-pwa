"use client";

import Image from "next/image";
import styles from "./select-game-intro.module.css";
import { threeAudioEngine } from "@/audio/three-audio-engine";
import { useEffect, useState } from "react";
import { appAudioManager } from "@/audio/app-audio-manager";
import { useAudioSession } from "@/store/audio-session";
import { Progress } from "@/components/ui/progress";

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
        "/assets/tahterevallis/audio/select-game-intro-v4.wav",
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
      appAudioManager.stop();
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    if (muted) {
      appAudioManager.stop();
    } else {
      appAudioManager.playLoop("select-game", threeAudioEngine.output, 0.0);
      appAudioManager.setVolumeSmooth(0.08);
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

      <div className={`${styles.MovingBallContainer}`}>
        <Image
          src="/assets/tahterevallis/images/intro-ball.png"
          alt="intro ball"
          width={566}
          height={566}
          className={styles.MovingBall}
          loading="eager"
        />
        <Image
          src="/assets/tahterevallis/images/intro-ball-trail.png"
          alt="intro ball trail"
          width={669}
          height={520}
          className={styles.MovingBallTrail}
          loading="eager"
        />
      </div>
    </div>
  );
}
