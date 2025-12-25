"use server";

import { cookies } from "next/headers";

export async function markIntroWatched() {
  const cookieStore = await cookies();
  cookieStore.set("intro_watched", "true", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });
}
