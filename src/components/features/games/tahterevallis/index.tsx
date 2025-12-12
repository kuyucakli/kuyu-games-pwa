"use client";

import { useEffect, useRef } from "react";
import { Game } from "@/components/features/games/tahterevallis/core";
import { HUDBox, HUDLayer } from "../shared/ui/heads-up-display";
import { useDeviceTilt } from "@/hooks/use-device-tilt";

type GameTahterevallisSceneProps = {
  width?: `${number}${"px" | "vw" | "dvw"}`;
  height?: `${number}${"px" | "vh" | "dvh"}`;
};

export default function GameTahterevallis({
  width = "100vw",
  height = "100vh",
}: GameTahterevallisSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const deviceTilt = useDeviceTilt();
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
        <div className="absolute top-18 right-0 flex gap-4 p-4">
          <HUDBox
            label="score"
            content={JSON.stringify(deviceTilt)}
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
