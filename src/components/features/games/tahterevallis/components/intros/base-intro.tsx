"use client";

import {
  AnimationEventHandler,
  PropsWithChildren,
  useRef,
  useState,
} from "react";
import styles from "./intros.module.css";
import Image from "next/image";
import { ButtonDefault } from "@/components/ui/buttons";

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
    startAndAutoEnd ? "startAndAutoEnd" : "start",
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
      ${state === "start" ? styles.IntroStart : ""} 
      ${state === "end" ? styles.IntroEnd : ""}
      ${state === "startAndAutoEnd" ? styles.IntroStartAndAutoEnd : ""}
      `}
    >
      <Image
        src="/assets/tahterevallis/images/tahterevallis-game-over-circle.svg"
        alt="fx"
        width="600"
        height="600"
        className={`${styles.ShapeImage}  ${
          state === "start" ? styles.ShapeImageIn : ""
        } 
      ${state === "end" ? styles.ShapeImageOut : ""}
        ${state === "startAndAutoEnd" ? styles.ShapeImageAutoInAndOut : ""}`}
      />
      {children}
      {actionButtonLabel && (
        <div className="my-8">
          <ButtonDefault type="button" onClick={() => setState("end")}>
            <span className="text-lg">{actionButtonLabel}</span>
          </ButtonDefault>
        </div>
      )}
    </div>
  );
}
