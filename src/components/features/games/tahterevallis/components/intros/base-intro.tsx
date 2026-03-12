"use client";

import {
  AnimationEventHandler,
  PropsWithChildren,
  useRef,
  useState,
} from "react";
import styles from "./intros.module.css";

import { ButtonDefault } from "@/components/ui/buttons";
import { StarShape } from "../shapes";

type introState = "start" | "end" | "idle" | "startAndAutoEnd";
type BaseIntroProps = PropsWithChildren<{
  className?: string;
  onCloseAction?: () => void;
  startAndAutoEnd?: boolean;
  actionButtonLabel?: string;
  themeColor?: string;
}>;

export function BaseIntro({
  children,
  className,
  onCloseAction,
  startAndAutoEnd,
  actionButtonLabel,
  themeColor = "text-red-500",
}: BaseIntroProps) {
  const containerRef = useRef(null);
  const [state, setState] = useState<introState>(
    startAndAutoEnd ? "startAndAutoEnd" : "start",
  );

  const handleAnimationEnd: AnimationEventHandler<HTMLDivElement> = (e) => {
    if (e.target !== e.currentTarget) return;

    if (state === "end" || state === "startAndAutoEnd") {
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
      <StarShape
        className={`${styles.ShapeImage} ${themeColor} ${
          state === "start" ? styles.ShapeImageIn : ""
        } 
      ${state === "end" ? styles.ShapeImageOut : ""}
        ${state === "startAndAutoEnd" ? styles.ShapeImageAutoInAndOut : ""} `}
      />

      {children}
      {actionButtonLabel && (
        <div className="my-8">
          <ButtonDefault
            type="button"
            onClick={() => setState("end")}
            className="bg-transparent! border-4"
          >
            <span className="text-lg">{actionButtonLabel}</span>
          </ButtonDefault>
        </div>
      )}
    </div>
  );
}
