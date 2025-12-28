import { GameSelectionNav } from "@/components/features/navs/game-selection-nav";
import { Modal } from "@/components/ui/modal";

export default function SelectGame() {
  return (
    <Modal>
      <GameSelectionNav />
    </Modal>
  );
}
