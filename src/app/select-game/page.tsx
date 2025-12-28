import { GameSelectionNav } from "@/components/features/navs";
import { cookies } from "next/headers";

export default async function HomePage() {
  const cookieStore = await cookies();
  const introWatched = cookieStore.get("intro_watched")?.value === "true";
  return <GameSelectionNav withLogoIntro={introWatched} />;
}
