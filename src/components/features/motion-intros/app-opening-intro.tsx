"use client";
import Image from "next/image";
import styles from "./app-opening-intro.module.css";
import { markIntroWatched } from "@/lib/actions/cookies";
import { useRouter } from "next/navigation";

export function AppOpeningIntro() {
  const router = useRouter();

  const handleIntroEnd = async () => {
    await markIntroWatched();
    router.push("/select-game");
  };
  return (
    <div
      className={styles.AppOpeningIntro}
      onAnimationEnd={() => {
        handleIntroEnd();
      }}
    >
      <Image
        className={styles.AppOpeningIntroLogo}
        src="/assets/images/kuyu-games-logo.png"
        alt="kuyu games logo"
        width="210"
        height="278"
      />
    </div>
  );
}
