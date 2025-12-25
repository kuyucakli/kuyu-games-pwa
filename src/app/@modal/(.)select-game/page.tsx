"use client";

import { GameSelectionNav } from "@/components/features/navs";
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
