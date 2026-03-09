"use client";

import { PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IconArrowBack, IconClose } from "../icons";
import { ButtonRounded } from "../buttons";

export function Modal({
  children,
  onCloseAction,
  onOpenAction,
  className = "",
}: PropsWithChildren & {
  onCloseAction?: () => void;
  onOpenAction?: () => void;
  className?: string;
}) {
  const router = useRouter();

  useEffect(() => {
    onOpenAction?.();

    return () => {
      onCloseAction?.();
    };
  }, [onCloseAction, onOpenAction]);

  return (
    <dialog
      className={`w-full h-full fixed top-0 left-0 bg-neutral-800/90 z-50 backdrop-blur-xs flex items-center justify-center text-inherit ${className} `}
      open
    >
      <ButtonRounded
        onClick={() => router.back()}
        aria-label="Close"
        className="absolute! top-4 right-4 text-gray-200 hover:text-gray-100 z-10"
      >
        <IconArrowBack size={24} />
      </ButtonRounded>
      {children}
    </dialog>
  );
}
