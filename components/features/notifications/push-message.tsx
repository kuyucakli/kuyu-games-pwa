"use client";

import { sendNotification } from "@/lib/actions";
import { useServiceWorkerStore } from "@/store/service-worker-store";
import { usePushStore } from "@/store/use-push-store";
import { useEffect, useState } from "react";

export function PushMessage() {
  const { subscription, subscribe, unsubscribe } = usePushStore();
  const [message, setMessage] = useState("");

  // Access SW support and registration
  const { isSupported, register } = useServiceWorkerStore();

  // Register service worker on component mount
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
    <div>
      <h3>Push Notifications</h3>
      {subscription ? (
        <>
          <p>You are subscribed to push notifications.</p>
          <button onClick={unsubscribe}>Unsubscribe</button>
          <input
            type="text"
            placeholder="Enter notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendTestNotification}>Send Test</button>
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
