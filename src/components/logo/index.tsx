import Image from "next/image";
import { HTMLAttributes } from "react";

export function LogoKuyuGames({ className }: HTMLAttributes<HTMLImageElement>) {
  return (
    <Image
      src="/assets/images/kuyu-games-logo.png"
      alt="kuyu-games-logo"
      width={52 * 0.9}
      height={70 * 0.9}
      className={`${className}`}
    />
  );
}
