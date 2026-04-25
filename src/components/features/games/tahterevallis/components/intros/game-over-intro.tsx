"use client";

import { BaseIntro } from "./base-intro";
import styles from "./intros.module.css";

export function GameOverIntro({
  onRequestGameReplay,
}: {
  onRequestGameReplay: () => void;
}) {
  return (
    <BaseIntro
      className={`${styles.GameOverContainer}  z-50`}
      onCloseAction={onRequestGameReplay}
      actionButtonLabel="Restart"
    >
      <h1 className="text-5xl blur-[1px]">Game Over</h1>
    </BaseIntro>
  );
}
