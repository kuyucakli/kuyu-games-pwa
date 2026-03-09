"use client";
import { GameSelectionNav } from "@/components/features/navs/game-selection-nav";
import { NavMain } from "@/components/features/navs/nav-main";
import { Modal } from "@/components/ui/modal";
import { gameBusCommands } from "@/games/tahterevallis";

export default function SelectGame() {
  return (
    <Modal
      className=""
      onCloseAction={() => {
        gameBusCommands.emit("play");
      }}
      onOpenAction={() => {
        gameBusCommands.emit("pause");
      }}
    >
      <NavMain className="absolute top-4 right-4" />
      <GameSelectionNav />
    </Modal>
  );
}
