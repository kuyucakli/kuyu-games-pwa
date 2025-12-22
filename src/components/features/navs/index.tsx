import { LinkButton, LinkButtonArtistic } from "@/components/ui/buttons";
import { MotionIntro1 } from "../motion-intros";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  GlassCard,
} from "@/components/ui/card";

export function GameSelectionNav() {
  return (
    <>
      <MotionIntro1 />
      <div className="w-dvw h-dvh flex flex-col items-center justify-center relative  gap-8 bg-[url(/assets/tahterevallis/images/bg-intro.webp)] bg-cover">
        <GlassCard>
          <CardHeader>
            <CardTitle>SELECT GAME</CardTitle>
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
