"use client";

import {
  AnimationEventHandler,
  PropsWithChildren,
  useRef,
  useState,
} from "react";
import styles from "./intros.module.css";

type introState = "start" | "end" | "idle" | "startAndAutoEnd";
type BaseIntroProps = PropsWithChildren<{
  className?: string;
  onCloseAction?: () => void;
  startAndAutoEnd?: boolean;
  actionButtonLabel?: string;
}>;

export function BaseIntro({
  children,
  className,
  onCloseAction,
  startAndAutoEnd,
  actionButtonLabel,
}: BaseIntroProps) {
  const containerRef = useRef(null);
  const [state, setState] = useState<introState>(
    startAndAutoEnd ? "startAndAutoEnd" : "start"
  );

  const handleAnimationEnd: AnimationEventHandler<HTMLDivElement> = (e) => {
    if (e.target !== e.currentTarget) return;

    if (state == "end" || state == "startAndAutoEnd") {
      onCloseAction?.();
      setState("idle");
    }
  };

  if (state === "idle") return null;

  return (
    <div
      ref={containerRef}
      onAnimationEnd={handleAnimationEnd}
      className={`${styles.IntroContainer}  ${className} 
      ${state == "start" ? styles.IntroStart : ""} 
      ${state == "end" ? styles.IntroEnd : ""}
      ${state == "startAndAutoEnd" ? styles.IntroStartAndAutoEnd : ""}
      `}
    >
      {children}
      {actionButtonLabel && (
        <button type="button" onClick={() => setState("end")}>
          {actionButtonLabel}
        </button>
      )}
    </div>
  );
}
