import { PropsWithChildren } from "react";

export function Modal({ children }: PropsWithChildren) {
  return (
    <dialog
      className="w-full h-full fixed top-0 left-0 bg-neutral-800/50 z-50"
      open
    >
      {children}
    </dialog>
  );
}
