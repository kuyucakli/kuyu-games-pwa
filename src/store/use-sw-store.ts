import { create } from "zustand";

interface SwState {
  registration: ServiceWorkerRegistration | null;
  isSupported: boolean;
  register: () => Promise<void>;
}

export const useSwStore = create<SwState>((set) => ({
  registration: null,
  isSupported: "serviceWorker" in navigator,

  register: async () => {
    if (!("serviceWorker" in navigator)) return;

    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });

    set({ registration });
  },
}));
