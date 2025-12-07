import { LinkButton } from "@/components/ui/buttons";
import { MotionIntro1 } from "../motion-intros";

export function GameSelectionNav() {
  return (
    <>
      <div className="w-dvw h-dvh flex flex-col items-center justify-center relative  gap-8 z-10">
        <h1 className="text-4xl text-white">Select a game </h1>
        <nav>
          <LinkButton href="/pinball">Pinball</LinkButton>
          <LinkButton href="/tahterevalli">Tahterevallis</LinkButton>
          {/* <PWAInstallBanner />
        <PushMessage /> */}
        </nav>
      </div>
      <MotionIntro1 />
    </>
  );
}
