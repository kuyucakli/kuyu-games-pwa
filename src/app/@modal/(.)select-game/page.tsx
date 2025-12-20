"use client";

import { MotionIntro1 } from "@/components/features/motion-intros";
import { GameSelectionNav } from "@/components/features/navs";
import { LinkButton } from "@/components/ui/buttons";
import { Modal } from "@/components/ui/modal";
import { gameEvents } from "@/games/tahterevallis";
import { useEffect } from "react";

export default function SelectGame() {
  useEffect(() => {
    gameEvents.emit("audio:select-game");
  }, []);
  return (
    <Modal>
      <GameSelectionNav />
    </Modal>
  );
}
