import Image from "next/image";
import { HTMLAttributes } from "react";

export function LogoKuyuGames({ className }: HTMLAttributes<HTMLImageElement>) {
  return (
    <Image
      src="/assets/images/kuyu-games-logo.png"
      alt="kuyu-games-logo"
      width={52 * 1.1}
      height={70 * 1.1}
      className={`${className}`}
    />
  );
}
