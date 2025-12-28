"use client";

import { PropsWithChildren, createContext, useContext } from "react";
import { useRouter } from "next/navigation";

const ModalCtx = createContext(false);
export const useIsModal = () => useContext(ModalCtx);

export function Modal({ children }: PropsWithChildren) {
  const router = useRouter();
  return (
    <ModalCtx value={true}>
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
    </ModalCtx>
  );
}
