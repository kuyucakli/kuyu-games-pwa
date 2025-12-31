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
      <h1 className="text-5xl">Game Over</h1>
    </BaseIntro>
  );
}
