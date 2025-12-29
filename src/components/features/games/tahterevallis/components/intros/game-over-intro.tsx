"use client";
import { AnimationEventHandler, useRef, useState } from "react";
import styles from "./intros.module.css";

type introState = "start" | "end" | "idle";

export function GameOverIntro({
  onRequestGameReplay,
}: {
  onRequestGameReplay: () => void;
}) {
  const containerRef = useRef(null);
  const [state, setState] = useState<introState>("start");

  const handleAnimationEnd: AnimationEventHandler<HTMLDivElement> = (e) => {
    if (e.target !== e.currentTarget) return;

    if (state == "end") {
      setState("idle");
    }
  };

  const handleReplay = () => {
    onRequestGameReplay();
    setState("end");
  };

  if (state === "idle") return null;

  return (
    <div
      ref={containerRef}
      onAnimationEnd={handleAnimationEnd}
      className={`${styles.IntroContainer}  ${styles.GameOverContainer} ${
        state == "start" ? styles.IntroStart : ""
      } ${state == "end" ? styles.IntroEnd : ""}`}
    >
      <h1 className="text-5xl">Game Over</h1>
      <button type="button" onClick={handleReplay}>
        Replay
      </button>
    </div>
  );
}
