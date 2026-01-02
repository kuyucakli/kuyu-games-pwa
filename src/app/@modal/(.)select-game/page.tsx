"use client";
import { GameSelectionNav } from "@/components/features/navs/game-selection-nav";
import { Modal } from "@/components/ui/modal";
import { gameBusCommands } from "@/games/tahterevallis";

export default function SelectGame() {
  return (
    <Modal
      onCloseAction={() => {
        gameBusCommands.emit("play");
      }}
      onOpenAction={() => {
        gameBusCommands.emit("pause");
      }}
    >
      <GameSelectionNav />
    </Modal>
  );
}
