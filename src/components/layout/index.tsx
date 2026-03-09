import { ReactNode } from "react";

export function HeaderMain({ children }: { children: ReactNode }) {
  return (
    <header className="fixed top-4  right-4 flex gap-4 z-40">{children}</header>
  );
}
