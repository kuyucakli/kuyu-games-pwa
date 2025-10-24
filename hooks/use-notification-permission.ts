import { useEffect, useState } from "react";

export type NotificationPermissionState =
  | "default"
  | "granted"
  | "denied"
  | "unsupported"
  | "blocked-system";

export function useNotificationPermission() {
  const [permission, setPermission] =
    useState<NotificationPermissionState>("default");

  // Check support and current permission
  useEffect(() => {
    if (!("Notification" in window)) {
      setPermission("unsupported");
      return;
    }

    setPermission(Notification.permission as NotificationPermission);
  }, []);

  // Function to request permission from the user
  async function requestPermission() {
    if (!("Notification" in window)) {
      setPermission("unsupported");
      return "unsupported";
    }

    if (Notification.permission === "default") {
      try {
        const result = await Notification.requestPermission();
        setPermission(result as NotificationPermission);
        return result;
      } catch {
        setPermission("blocked-system");
        return "blocked-system";
      }
    }

    // Already granted or denied
    setPermission(Notification.permission as NotificationPermission);
    return Notification.permission as NotificationPermission;
  }

  return { permission, requestPermission };
}
