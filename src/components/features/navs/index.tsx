import { LinkButtonArtistic } from "@/components/ui/buttons";
import { SelectGameIntro } from "../motion-intros/select-game-intro";
import {
  CardContent,
  CardHeader,
  CardTitle,
  GlassCard,
} from "@/components/ui/card";
import Image from "next/image";

export function GameSelectionNav() {
  return (
    <>
      <SelectGameIntro />
      <div className="w-dvw h-dvh flex flex-col items-center justify-center relative  gap-8 bg-[url(/assets/tahterevallis/images/bg-intro.webp)] bg-cover">
        <GlassCard>
          <CardHeader>
            <Image
              src="/assets/images/kuyu-games-logo.png"
              alt="kuyu-games-logo"
              width={52 * 0.9}
              height={70 * 0.9}
              className="mx-auto mt-4 mb-8"
            />
            <CardTitle className="animate-pulse">SELECT GAME</CardTitle>
          </CardHeader>
          <CardContent>
            <nav>
              <LinkButtonArtistic href="/pinball">Pinball</LinkButtonArtistic>
              <LinkButtonArtistic href="/tahterevalli">
                Tahterevallis
              </LinkButtonArtistic>
            </nav>
          </CardContent>
        </GlassCard>
      </div>
    </>
  );
}
