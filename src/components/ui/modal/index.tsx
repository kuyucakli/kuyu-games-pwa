"use client";

import { PropsWithChildren } from "react";
import { useRouter } from "next/navigation";

export function Modal({ children }: PropsWithChildren) {
  const router = useRouter();
  return (
    <dialog
      className="w-full h-full fixed top-0 left-0 bg-neutral-800/90 z-50 backdrop-blur-xs"
      open
    >
      <button
        onClick={() => router.back()}
        aria-label="Close"
        className="absolute top-2 right-2 text-gray-200 hover:text-gray-100 z-10"
      >
        Close
      </button>
      {children}
    </dialog>
  );
}
