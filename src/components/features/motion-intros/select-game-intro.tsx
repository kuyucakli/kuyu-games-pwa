"use client";

import Image from "next/image";
import styles from "./select-game-intro.module.css";
import { threeAudioEngine } from "@/audio/three-audio-engine";
import { useEffect, useState } from "react";
import { appAudioManager } from "@/audio/app-audio-manager";
import { useAudioSession } from "@/store/audio-session";

export function SelectGameIntro() {
  const muted = useAudioSession((state) => state.muted);
  const [ready, setReady] = useState(false);

  // 1. Load + unlock ONCE
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const ctx = threeAudioEngine.listener.context;

      await appAudioManager.load(
        "select-game",
        "/assets/tahterevallis/audio/select-game-intro-v2.wav",
        ctx
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
      appAudioManager.setVolumeSmooth(0.016);
    }
  }, [muted, ready]);

  return (
    <div className={styles.SelectGameIntro}>
      {!ready && <p className="text-xs">Loading...</p>}

      <div className={styles.MovingBallContainer}>
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
