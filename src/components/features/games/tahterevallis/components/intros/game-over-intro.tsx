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
      className={`${styles.GameOverContainer} bg-[url(/assets/tahterevallis/images/bg-board-texture.png)] bg-cover  bg-no-repeat z-50`}
      onCloseAction={onRequestGameReplay}
      actionButtonLabel="Replay"
    >
      <h1 className="text-5xl blur-[1px]">Game Over</h1>
    </BaseIntro>
  );
}
