"use client";

import { useEffect, useRef, useState } from "react";
import { Game } from "@/games/tahterevallis";
import { HUDBox, HUDLayer } from "../shared/ui/heads-up-display";
import { Engine } from "@/games/engine/core/engine";
import { gameEvents as tahterevallisEvents } from "@/games/tahterevallis";

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
  useEffect(() => {
    let engine: Engine | null = null;

    (async () => {
      if (!containerRef.current) return;
      engine = await Engine.create(containerRef.current);
      tahterevallisEvents.on("assets:completed", () => {
        setLoading(false);
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
      <HUDLayer>
        <div className="absolute top-18 right-0 flex gap-4 p-4">
          <HUDBox
            label="score"
            content={loading ? "loading" : "loaded"}
            className=" border-amber-100! text-orange-500! bg-amber-300!"
          />
          <HUDBox label="test" content="45" />
        </div>
      </HUDLayer>
      <div
        ref={containerRef}
        style={{ width: `${width}`, height: `${height}` }}
        className="relative overflow-hidden"
      />
    </>
  );
}
