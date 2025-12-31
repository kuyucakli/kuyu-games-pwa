import { ReactNode } from "react";

export function HeaderMain({ children }: { children: ReactNode }) {
  return (
    <header className="fixed top-2  right-2 flex gap-4 z-40">{children}</header>
  );
}
