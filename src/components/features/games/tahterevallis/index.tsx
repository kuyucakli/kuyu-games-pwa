"use client";

import { useEffect, useRef, useState } from "react";
import { Game, gameBusCommands } from "@/games/tahterevallis";
import { HUDBox, HUDLayer } from "../shared/ui/heads-up-display";
import { Engine } from "@/games/engine/core/engine";
import {
  gameEvents as tahterevallisEvents,
  GameEvents as TahtervallisGameEventDataTypes,
} from "@/games/tahterevallis";
import { GameOverIntro } from "./components/intros/game-over-intro";
import { LevelCompletedIntro } from "./components/intros/level-completed-intro";

import { Property } from "@/lib/types/utils";
import { LoadingIntro } from "./components/intros/loading-intro";

import { AssetLoaderEvent } from "@/games/engine/assets/asset-manager";
import { Progress } from "@/components/ui/progress";

type GameTahterevallisProps = {
  width?: `${number}${"px" | "vw" | "dvw"}`;
  height?: `${number}${"px" | "vh" | "dvh"}`;
};

export default function GameTahterevallis({
  width = "100vw",
  height = "100vh",
}: GameTahterevallisProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] =
    useState<Property<AssetLoaderEvent, "progress">>();

  const [gameState, setGameState] = useState<"failed" | "level-completed" | "">(
    "",
  );
  const [level, setLevel] = useState(1);
  const [remainingTimeData, setRemainingTimeData] = useState<
    TahtervallisGameEventDataTypes["level:remaining-time"]
  >({
    prettyFormatted: "",
    seconds: -1,
  });

  useEffect(() => {
    let engine: Engine | null = null;
    let game: Game;
    (async () => {
      if (!containerRef.current) return;
      engine = await Engine.create(containerRef.current);
      tahterevallisEvents.on("assets:completed", () => {
        setLoading(false);
      });
      tahterevallisEvents.on("assets:progress", (data) => {
        setProgress(data);
      });
      game = new Game();
      await engine.mount(game);
    })();

    return () => {
      game?.dispose();
      engine?.dispose();
    };
  }, []);

  useEffect(() => {
    const onLevelCompleted = ({
      nextLevel,
    }: TahtervallisGameEventDataTypes["level:completed"]) => {
      setLevel(nextLevel);
      setGameState("level-completed");
    };

    const onRemaining = ({
      prettyFormatted,
      seconds,
    }: TahtervallisGameEventDataTypes["level:remaining-time"]) => {
      setRemainingTimeData({ prettyFormatted, seconds });
    };

    const onFailed = () => {
      setGameState("failed");
      setLevel(1);
    };

    tahterevallisEvents.on("level:completed", onLevelCompleted);
    tahterevallisEvents.on("level:remaining-time", onRemaining);
    tahterevallisEvents.on("level:failed", onFailed);

    return () => {
      tahterevallisEvents.off("level:completed", onLevelCompleted);
      tahterevallisEvents.off("level:remaining-time", onRemaining);
      tahterevallisEvents.off("level:failed", onFailed);
    };
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

  return (
    <>
      <TahterevallisHUD
        loading={loading}
        progress={progress}
        level={level}
        remainingTimeData={remainingTimeData}
      />
      {gameState === "level-completed" && (
        <LevelCompletedIntro
          level={level}
          onIntroEnded={() => setGameState("")}
        />
      )}
      {gameState === "failed" && (
        <GameOverIntro onRequestGameReplay={requestGameReplay} />
      )}
      <div
        style={{
          "--hole-width": "680px",
          "--aspect-ratio": "4/3",
          /* We calculate the height based on the width and ratio */
          "--hole-height": "calc(var(--hole-width) / (4 / 2.7))",
          /* We calculate the offsets to keep it centered */
          "--x1": "calc((100% - var(--hole-width)) / 2)",
          "--x2": "calc(100% - var(--x1))",
          "--y1": "calc((100% - var(--hole-height)) / 2)",
          "--y2": "calc(100% - var(--y1))",
        }}
        className="
    fixed z-10 w-dvw h-dvh touch-none pointer-events-none
    bg-[url(/assets/tahterevallis/images/bg-board-texture.png),url(/assets/tahterevallis/images/bg-board-colored-stencils.png),url(/assets/tahterevallis/images/bg-board-colored-stencils-2.png)] bg-position-[center,center_left,bottom_right] bg-size-[cover,auto,auto] bg-no-repeat
    
    [clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%,0%_0%,var(--x1)_var(--y1),var(--x1)_var(--y2),var(--x2)_var(--y2),var(--x2)_var(--y1),var(--x1)_var(--y1))]
  "
      ></div>
      <div
        ref={containerRef}
        style={{ width: `${width}`, height: `${height}` }}
        className="relative overflow-hidden "
      />
    </>
  );
}

const TahterevallisHUD = ({
  loading,
  progress,
  level,
  remainingTimeData,
}: {
  loading: boolean;
  progress: Property<AssetLoaderEvent, "progress"> | undefined;
  level: number;
  remainingTimeData: TahtervallisGameEventDataTypes["level:remaining-time"];
}) => {
  return (
    <HUDLayer className="flex landscape:flex-col gap-2 p-2">
      <HUDBox label="level" content={level + ""} />
      {remainingTimeData.seconds >= 0 && remainingTimeData.seconds < 10 && (
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
    </HUDLayer>
  );
};
