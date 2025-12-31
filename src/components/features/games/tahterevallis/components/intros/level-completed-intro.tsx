"use client";

import styles from "./intros.module.css";
import { BaseIntro } from "./base-intro";

export function LevelCompletedIntro({
  level,
  onIntroEnded,
}: {
  level: number;
  onIntroEnded: () => void;
}) {
  return (
    <BaseIntro
      className={`${styles.LevelCompleted} `}
      startAndAutoEnd={true}
      onCloseAction={onIntroEnded}
    >
      <h1 className="text-8xl">LEVEL {level}</h1>
    </BaseIntro>
  );
}
