import { HTMLAttributes } from "react";
import styles from "./index.module.css";

export const FancyArrow = ({ className }: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className={`${styles.FancyArrow} ${className}`}>
      <span className={styles.FancyArrowDisc}></span>
      <span className={styles.FancyArrowLeg}></span>
      <span className={styles.FancyArrowLeg}></span>
    </span>
  );
};
