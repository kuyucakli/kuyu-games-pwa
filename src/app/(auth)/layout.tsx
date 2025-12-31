import { LogoKuyuGames } from "@/components/logo";
import { ReactNode } from "react";

export default function AuthLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex flex-col gap-2">
      <LogoKuyuGames className="m-auto" />
      {children}
    </div>
  );
}
