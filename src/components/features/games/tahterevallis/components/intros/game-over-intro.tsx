"use client";

import styles from "./intros.module.css";
import { BaseIntro } from "./base-intro";

export function GameOverIntro({
  onRequestGameReplay,
}: {
  onRequestGameReplay: () => void;
}) {
  return (
    <BaseIntro
      className={`${styles.GameOverContainer}`}
      onCloseAction={onRequestGameReplay}
      actionButtonLabel="Replay"
    >
      <h1 className="text-4xl blur-[1px]">Game Over</h1>
    </BaseIntro>
  );
}
