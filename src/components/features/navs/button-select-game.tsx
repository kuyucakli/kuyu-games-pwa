"use client";

import { LinkButtonRounded } from "@/components/ui/buttons";
import { IconGameList } from "@/components/ui/icons";
import { usePathname } from "next/navigation";

export function ButtonSelectGame() {
  const pathName = usePathname();
  const isSelectGamePage = pathName.includes("select-game");
  return (
    <LinkButtonRounded
      href="/select-game"
      className={`${isSelectGamePage ? "pointer-events-none opacity-40" : ""}`}
    >
      <IconGameList />
    </LinkButtonRounded>
  );
}
