import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useSwStore } from "./use-sw-store";
import { subscribeUser, unsubscribeUser } from "@/lib/actions";
import { urlBase64ToUint8Array } from "@/lib/utils/index";

interface PushState {
  subscription: any | null;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
}

export const usePushStore = create<PushState>()(
  persist(
    (set, get) => ({
      subscription: null,

      subscribe: async () => {
        const registration = useSwStore.getState().registration;
        if (!registration) throw new Error("Service Worker not registered yet");

        const sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
          ),
        });

        // store a JSON-safe version
        const subJson = JSON.parse(JSON.stringify(sub));
        set({ subscription: subJson });
        await subscribeUser(subJson);
      },

      unsubscribe: async () => {
        const sub = get().subscription;
        // you can’t call sub.unsubscribe() here because it’s JSON — real unsubscribe must come from PushManager
        const registration = useSwStore.getState().registration;
        const existingSub = await registration?.pushManager.getSubscription();
        await existingSub?.unsubscribe();
        set({ subscription: null });
        await unsubscribeUser();
      },
    }),
    {
      name: "push-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
