"use server";

import webpush, { PushSubscription } from "web-push";
import { createClient } from "@/lib/supabase/server";

webpush.setVapidDetails(
  "mailto:burak.kuyucakli@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function subscribeUser(sub: PushSubscription) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false };

  const { error } = await supabase.from("push_subscriptions_table").upsert({
    user_id: user.id,
    endpoint: sub.endpoint,
    p256dh: sub.keys.p256dh,
    auth_key: sub.keys.auth,
  });

  if (error) {
    console.error("Failed to unsubscribe user:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function unsubscribeUser() {
  const supabase = await createClient();

  // Get the current logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  const { error } = await supabase
    .from("push_subscriptions_table")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to unsubscribe user:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function sendNotification(message: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("push_subscriptions_table")
    .select("endpoint, p256dh, auth_key");

  console.log(data, "----");

  for (const record of data ?? []) {
    const subscription: PushSubscription = {
      endpoint: record.endpoint,
      keys: {
        p256dh: record.p256dh,
        auth: record.auth_key,
      },
    };

    try {
      await webpush.sendNotification(
        subscription,
        JSON.stringify({ title: "Test", body: message, icon: "/icon-like.png" })
      );
    } catch (error) {
      console.error("Error sending push", error);
    }
  }

  return { success: true };
}
