import { LinkButtonArtistic } from "@/components/ui/buttons";
import { SelectGameIntro } from "../motion-intros/select-game-intro";
import styles from "./navs.module.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export function GameSelectionNav() {
  return (
    <div className={`${styles.GameSelectionNavContainer} animate-pulse`}>
      <SelectGameIntro />

      <div className={`${styles.GameSelectionNavContent} `}>
        <Card>
          <CardHeader>
            <Image
              src="/assets/images/kuyu-games-logo.png"
              alt="kuyu-games-logo"
              width={52 * 0.9}
              height={70 * 0.9}
              className="mx-auto mt-0 mb-10 opacity-70"
            />
            <CardTitle>SELECT GAME</CardTitle>
          </CardHeader>
          <CardContent>
            <nav className="flex flex-col gap-1 mt-4">
              <LinkButtonArtistic href="/pinball">PINBALL</LinkButtonArtistic>
              <LinkButtonArtistic href="/tahterevallis">
                TAHTEREVALLIS
              </LinkButtonArtistic>
            </nav>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
