"use client";

import { PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IconClose } from "../icons";

export function Modal({
  children,
  onCloseAction,
  onOpenAction,
}: PropsWithChildren & {
  onCloseAction?: () => void;
  onOpenAction?: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    onOpenAction?.();

    return () => {
      onCloseAction?.();
    };
  }, []);

  return (
    <dialog
      className="w-full h-full fixed top-0 left-0 bg-neutral-800/90 z-50 backdrop-blur-xs flex items-center justify-center text-inherit"
      open
    >
      <button
        onClick={() => router.back()}
        aria-label="Close"
        className="absolute top-4 right-4 text-gray-200 hover:text-gray-100 z-10"
      >
        <IconClose fill="white"/>
      </button>
      {children}
    </dialog>
  );
}
