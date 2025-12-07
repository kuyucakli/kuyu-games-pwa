import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface InstallStore {
  dismissed: boolean;
  setDismissed: (value: boolean) => void;
}

export const useInstallStore = create<InstallStore>()(
  persist(
    (set) => ({
      dismissed: false,
      setDismissed: (value: boolean) => set({ dismissed: value }),
    }),
    {
      name: "pwa-install-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
