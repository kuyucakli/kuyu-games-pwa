"use client";

import { useEffect, useRef, useState } from "react";
import { Game, gameBusCommands } from "@/games/tahterevallis";
import { HUDBox, HUDLayer } from "../shared/ui/heads-up-display";
import { Engine } from "@/games/engine/core/engine";
import { gameEvents as tahterevallisEvents } from "@/games/tahterevallis";
import { GameOverIntro } from "./components/intros/game-over-intro";
import { LevelCompletedIntro } from "./components/intros/level-completed-intro";
import { AssetLoaderEvent } from "@/games/engine/assets/asset-manager";
import { Property } from "@/lib/types/utils";
import { LoadingIntro } from "./components/intros/loading-intro";

type GameTahterevallisSceneProps = {
  width?: `${number}${"px" | "vw" | "dvw"}`;
  height?: `${number}${"px" | "vh" | "dvh"}`;
};

export default function GameTahterevallis({
  width = "100vw",
  height = "100vh",
}: GameTahterevallisSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] =
    useState<Property<AssetLoaderEvent, "progress">>();

  useEffect(() => {
    let engine: Engine | null = null;

    (async () => {
      if (!containerRef.current) return;
      engine = await Engine.create(containerRef.current);
      tahterevallisEvents.on("assets:completed", () => {
        setLoading(false);
      });
      tahterevallisEvents.on("assets:progress", (data) => {
        setProgress(data);
      });
      const game = new Game();
      await engine.mount(game);
    })();

    return () => {
      engine?.dispose();
    };
  }, []);

  return (
    <>
      <TahterevallisHUD loading={loading} progress={progress} />
      <div
        ref={containerRef}
        style={{ width: `${width}`, height: `${height}` }}
        className="relative overflow-hidden"
      />
    </>
  );
}

const TahterevallisHUD = ({
  loading,
  progress,
}: {
  loading: boolean;
  progress: Property<AssetLoaderEvent, "progress"> | undefined;
}) => {
  const [level, setLevel] = useState(1);
  const [remainingTimeData, setRemainingTimeData] = useState<{
    prettyFormatted: string;
    seconds: null | number;
  }>({
    prettyFormatted: "",
    seconds: null,
  });
  const [gameState, setGameState] = useState<"failed" | "level-completed" | "">(
    ""
  );

  useEffect(() => {
    tahterevallisEvents.on("level:completed", ({ nextLevel }) => {
      setGameState("level-completed");
      setLevel(nextLevel);
    });
    tahterevallisEvents.on(
      "level:remaining-time",
      ({ prettyFormatted, seconds }) => {
        setRemainingTimeData({ prettyFormatted, seconds });
      }
    );
    tahterevallisEvents.on("level:failed", () => {
      setGameState("failed");
    });
  }, []);

  const requestGameReplay = () => {
    setGameState("");
    gameBusCommands.emit("replay");
  };

  const requestGamePause = () => {
    gameBusCommands.emit("pause");
  };

  const requestGameResume = () => {
    gameBusCommands.emit("play");
  };

  console.log("game state", gameState);
  return (
    <>
      <HUDLayer>
        <div className="absolute top-2 left-2 flex gap-2 p-0">
          <HUDBox label="level" content={level + ""} />
          {remainingTimeData.seconds != null &&
            remainingTimeData.seconds < 10 && (
              <p className="fixed top-1/2 left-1/2 -translate-1/2 text-9xl animate-pulse mix-blend-hard-light">
                {remainingTimeData.seconds}
              </p>
            )}
          <HUDBox
            label="score"
            content={"0"}
            className=" border-amber-100! text-orange-500! bg-amber-300!"
          />
          <HUDBox
            label="time left"
            content={remainingTimeData.prettyFormatted}
            className={`bg-red-500!  animate-pulse`}
          />
          {loading && (
            <LoadingIntro>
              <p className="text-white">
                {loading && <span>Loading: </span>}
                {progress?.lastLoaded} : {progress?.loadedCount} /{" "}
                {progress?.queueCount}
              </p>
            </LoadingIntro>
          )}
        </div>
      </HUDLayer>
      {gameState == "level-completed" && (
        <LevelCompletedIntro
          level={level}
          onIntroEnded={() => setGameState("")}
        />
      )}
      {gameState == "failed" && (
        <GameOverIntro onRequestGameReplay={requestGameReplay} />
      )}
    </>
  );
};
