"use client";

import { IconGameList } from "@/components/ui/icons";
import { gameBusCommands } from "@/games/tahterevallis";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function ButtonSelectGame() {
  const pathName = usePathname();
  const isSelectGamePage = pathName.includes("select-game");
  return (
    <Link
      href="/select-game"
      aria-disabled={isSelectGamePage}
      className={`${isSelectGamePage ? "pointer-events-none opacity-40" : ""}`}
    >
      <IconGameList />
    </Link>
  );
}
