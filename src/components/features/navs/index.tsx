import { LinkButtonArtistic } from "@/components/ui/buttons";
import { SelectGameIntro } from "../motion-intros/select-game-intro";
import styles from "./navs.module.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export function GameSelectionNav() {
  return (
    <div
      className={`${styles.GameSelectionNavContainer} animate-pulse`}
      style={{ background: "#5951ffab" }}
    >
      <SelectGameIntro />
      <div className={`${styles.GameSelectionNavContent} `}>
        <Card className="">
          <CardHeader>
            <Image
              src="/assets/images/kuyu-games-logo.png"
              alt="kuyu-games-logo"
              width={52 * 0.9}
              height={70 * 0.9}
              className="mx-auto mt-0 mb-8 opacity-70"
            />
            <CardTitle>SELECT GAME</CardTitle>
          </CardHeader>
          <CardContent>
            <nav>
              <LinkButtonArtistic href="/pinball">PINBALL</LinkButtonArtistic>
              <LinkButtonArtistic href="/tahterevalli">
                TAHTEREVALLIS
              </LinkButtonArtistic>
            </nav>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
