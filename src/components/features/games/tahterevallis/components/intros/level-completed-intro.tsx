"use client";

import { BaseIntro } from "./base-intro";
import styles from "./intros.module.css";

export function LevelCompletedIntro({
  level,
  onIntroEnded,
}: {
  level: number;
  onIntroEnded: () => void;
}) {
  return (
    <BaseIntro
      className={`${styles.LevelCompleted} bg-[url(/assets/tahterevallis/images/bg-board-texture.png)] bg-cover  bg-no-repeat z-50`}
      startAndAutoEnd={true}
      onCloseAction={onIntroEnded}
      themeColor="text-green-500"
    >
      <h1 className="text-5xl blur-[1px]">LEVEL {level}</h1>
    </BaseIntro>
  );
}
