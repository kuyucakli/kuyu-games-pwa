import { HTMLAttributes } from "react";
import styles from "./index.module.css";

export function Avatar({
  children,
  className,
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <figure className={`${styles.Avatar} ${className}`}>{children}</figure>
  );
}
