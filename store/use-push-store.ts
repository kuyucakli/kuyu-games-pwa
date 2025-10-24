import { create } from "zustand";
import { useServiceWorkerStore } from "./service-worker-store";
import { subscribeUser, unsubscribeUser } from "@/lib/actions";
import { urlBase64ToUint8Array } from "@/lib/utils";

interface PushState {
  subscription: PushSubscription | null;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
}

export const usePushStore = create<PushState>((set, get) => ({
  subscription: null,

  subscribe: async () => {
    const registration = useServiceWorkerStore.getState().registration;
    if (!registration) throw new Error("Service Worker not registered yet");

    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });

    set({ subscription: sub });
    await subscribeUser(JSON.parse(JSON.stringify(sub)));
  },

  unsubscribe: async () => {
    const sub = get().subscription;
    await sub?.unsubscribe();
    set({ subscription: null });
    await unsubscribeUser();
  },
}));
