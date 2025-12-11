import { ReactNode } from "react";

export function HeaderMain({ children }: { children: ReactNode }) {
  return (
    <header className="fixed top-8  right-8 flex gap-8 z-40">{children}</header>
  );
}
