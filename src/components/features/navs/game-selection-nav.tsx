import { LinkButtonArtistic } from "@/components/ui/buttons";
import { SelectGameIntro } from "../motion-intros/select-game-intro";
import styles from "./navs.module.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoKuyuGames } from "@/components/logo";
import { Settings } from "../games/shared/settings";

export function GameSelectionNav() {
  return (
    <div className={`${styles.GameSelectionNavContainer} animate-pulse `}>
      <SelectGameIntro />

      <div className={`${styles.GameSelectionNavContent} `}>
        <Card>
          <CardHeader>
            <LogoKuyuGames className="mx-auto mt-0 mb-10 opacity-70" />
            <CardTitle>SELECT GAME</CardTitle>
          </CardHeader>
          <CardContent>
            <nav className="flex flex-col gap-3 mt-4 mb-12">
              <LinkButtonArtistic href="/pinball">PINBALL</LinkButtonArtistic>
              <LinkButtonArtistic href="/tahterevallis">
                TAHTEREVALLIS
              </LinkButtonArtistic>
            </nav>
            <Settings />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
