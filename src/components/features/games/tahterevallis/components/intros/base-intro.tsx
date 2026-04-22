"use client";

import {
  AnimationEventHandler,
  PropsWithChildren,
  useRef,
  useState,
} from "react";
import styles from "./intros.module.css";

import { ButtonDefault } from "@/components/ui/buttons";

type introState = "start" | "end" | "idle" | "startAndAutoEnd";
type BaseIntroProps = PropsWithChildren<{
  className?: string;
  onCloseAction?: () => void;
  startAndAutoEnd?: boolean;
  actionButtonLabel?: string;
  themeColor?: string;
  textContent?: string;
}>;

export function BaseIntro({
  children,
  className,
  onCloseAction,
  startAndAutoEnd,
  actionButtonLabel,
  textContent,
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
      {" "}
      {children}
      {textContent && <h2 className="text-9xl relative z-50">{textContent}</h2>}
      {actionButtonLabel && (
        <div className="my-8">
          <ButtonDefault
            type="button"
            onClick={() => setState("end")}
            className="relative border-3 w-22! h-22! min-w-auto! rounded-full!"
          >
            <span className="text-lg">{actionButtonLabel}</span>
          </ButtonDefault>
        </div>
      )}
    </div>
  );
}
