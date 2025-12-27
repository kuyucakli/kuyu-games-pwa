"use client";

import { use, useEffect, useRef, useState } from "react";
import { Game } from "@/games/tahterevallis";
import { HUDBox, HUDLayer } from "../shared/ui/heads-up-display";
import { Engine } from "@/games/engine/core/engine";
import { gameEvents as tahterevallisEvents } from "@/games/tahterevallis";
import { GameOverIntro } from "./components/intros/game-over-intro";
import { LevelCompletedIntro } from "./components/intros/level-completed-intro";
import {
  AssetLoaderEvent,
  AssetManager,
} from "@/games/engine/assets/asset-manager";
import { Property } from "@/lib/types/utils";

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
        className="relative overflow-hidden bg-blue-800"
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
  const [time, setTime] = useState("");
  const [gameState, setGameState] = useState("");

  useEffect(() => {
    tahterevallisEvents.on("level:completed", ({ nextLevel }) => {
      setLevel(nextLevel);
    });
    tahterevallisEvents.on("level:remaining-time", ({ prettyFormatted }) => {
      setTime(prettyFormatted);
    });
    tahterevallisEvents.on("level:failed", () => {
      setGameState("failed");
    });

    tahterevallisEvents.on("level:completed", () => {
      setGameState("level-completed");
    });
  });
  return (
    <HUDLayer>
      <div className="absolute top-2 left-2 flex gap-4 p-4">
        <HUDBox label="level" content={level + ""} />
        <HUDBox label="time left" content={time} />
        <HUDBox
          label="score"
          content={"0"}
          className=" border-amber-100! text-orange-500! bg-amber-300!"
        />
        <p className="text-white">
          {loading && <span>Loading</span>}
          {progress?.lastLoaded} : {progress?.loadedCount} /{" "}
          {progress?.queueCount}
        </p>
        {gameState == "level-completed" && <LevelCompletedIntro />}
        {gameState == "failed" && <GameOverIntro />}
      </div>
    </HUDLayer>
  );
};
