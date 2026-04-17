"use client";

import { usePathname } from "next/navigation";
import { LinkButtonRounded } from "@/components/ui/buttons";
import { IconGameList } from "@/components/ui/icons";

export function ButtonSelectGame() {
  const pathName = usePathname();
  const isSelectGamePage = pathName.includes("select-game");
  return (
    <LinkButtonRounded
      href="/select-game"
      className={`${isSelectGamePage ? "pointer-events-none opacity-40" : ""} `}
    >
      <IconGameList size="20px" />
    </LinkButtonRounded>
  );
}
