"use client";

import { sendNotification } from "@/lib/actions/notificications";
import { useSwStore } from "@/store/use-sw-store";
import { usePushStore } from "@/store/use-push-store";
import { useEffect, useState } from "react";

export function PushMessage() {
  const { subscription, subscribe, unsubscribe } = usePushStore();
  const [message, setMessage] = useState("");

  const { isSupported, register } = useSwStore();

  useEffect(() => {
    if (isSupported) {
      register();
    }
  }, [isSupported, register]);

  async function sendTestNotification() {
    if (subscription) {
      await sendNotification(message);
      setMessage("");
    }
  }

  return (
    <div className="flex flex-col w-100 m-auto p-8 border border-amber-300">
      <h3 className="text-2xl">Push Notifications</h3>
      {subscription ? (
        <>
          <p>You are subscribed to push notifications.</p>
          <button onClick={unsubscribe}>Unsubscribe</button>
          <input
            type="text"
            placeholder="Enter notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-100 h-24 px-4 border border-neutral-500 rounded-lg"
          />
          <button type="button" onClick={sendTestNotification}>
            Send Test
          </button>
        </>
      ) : (
        <>
          <p>You are not subscribed to push notifications.</p>
          <button onClick={subscribe}>Subscribe</button>
        </>
      )}
    </div>
  );
}
