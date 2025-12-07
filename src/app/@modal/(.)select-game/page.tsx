import { MotionIntro1 } from "@/components/features/motion-intros";
import { GameSelectionNav } from "@/components/features/navs";
import { LinkButton } from "@/components/ui/buttons";
import { Modal } from "@/components/ui/modal";

export default function SelectGame() {
  return (
    <Modal>
      <GameSelectionNav />
    </Modal>
  );
}
