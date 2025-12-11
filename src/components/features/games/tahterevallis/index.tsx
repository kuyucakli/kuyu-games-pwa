"use client";

import { useEffect, useRef } from "react";
import { Game } from "@/components/features/games/tahterevallis/core";
import { HUDBox, HUDLayer } from "../shared/ui/heads-up-display";

type GameTahterevallisSceneProps = {
  width?: `${number}${"px" | "vw" | "dvw"}`;
  height?: `${number}${"px" | "vh" | "dvh"}`;
};

export default function GameTahterevallis({
  width = "100vw",
  height = "100vh",
}: GameTahterevallisSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const game = new Game(containerRef.current);

    (async () => {
      await game.init();

      game.start();
    })();

    return () => game.dispose();
  }, []);

  return (
    <>
      <HUDLayer>
        <HUDBox
          label="score"
          content="100"
          className="absolute top-24 right-110 border-amber-100! text-orange-500! bg-amber-300!"
        />
        <HUDBox
          label="test"
          content="45"
          className="absolute top-24 right-80"
        />
      </HUDLayer>
      <div
        ref={containerRef}
        style={{ width: `${width}`, height: `${height}` }}
        className="relative overflow-hidden"
      />
    </>
  );
}
