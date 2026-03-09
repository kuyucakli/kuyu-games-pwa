"use client";

import { ButtonDefault } from "@/components/ui/buttons";
import { SelectGameIntro } from "../motion-intros/select-game-intro";
import styles from "./navs.module.css";
import buttonStyles from "@/components/ui/buttons/buttons.module.css";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LogoKuyuGames } from "@/components/logo";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IconPlay } from "@/components/ui/icons";
import { useDeviceTilt } from "@/hooks/use-device-tilt";

export function GameSelectionNav() {
  const navContainerElRef = useRef(null);
  const [path, setPath] = useState("/");
  const [sceneState, setSceneState] = useState<"entered" | "exiting" | "idle">(
    "entered",
  );

  const { requestPermission } = useDeviceTilt();

  useEffect(() => {
    if (!navContainerElRef.current) return;
  });

  return (
    <div
      ref={navContainerElRef}
      className={`${styles.GameSelectionNavContainer} `}
    >
      <SelectGameIntro
        exit={sceneState === "exiting"}
        onExit={() => {
          if (sceneState !== "exiting") return;
          redirect(path);
        }}
      />

      <div
        className={`${styles.GameSelectionNavContent} ${
          sceneState === "exiting" ? styles.GameSelectionNavContentExit : ""
        } `}
      >
        <Card className="min-h-dvh!  flex flex-col justify-between md:min-h-[600px]!">
          <CardHeader className="pt-10 md:pt-0">
            <LogoKuyuGames className="mx-auto mt-0 mb-10 opacity-90" />
          </CardHeader>
          <CardContent className="pb-0!">
            <nav className="flex flex-col gap-3 mt-4 mb-12">
              {/* <Settings /> */}
              <ButtonDefault
                onClick={async () => {
                  await requestPermission();

                  setSceneState("exiting");
                  setPath("/tahterevallis");
                }}
                icon={<IconPlay fill="white" />}
                className={buttonStyles.ButtonShimmer}
              >
                Play Tahterevallis
              </ButtonDefault>

              <ButtonDefault
                icon={<IconPlay fill="white" />}
                className="opacity-40"
              >
                Play Pinball <br />
                <span className="text-xs block text-neutral-400">
                  {" "}
                  under development{" "}
                </span>
              </ButtonDefault>
            </nav>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
