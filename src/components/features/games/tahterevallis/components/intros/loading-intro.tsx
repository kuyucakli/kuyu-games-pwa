import type { PropsWithChildren } from "react";
import styles from "./intros.module.css";

export function LoadingIntro({ children }: PropsWithChildren) {
  return <div className={`${styles.IntroContainer}`}>{children}</div>;
}
