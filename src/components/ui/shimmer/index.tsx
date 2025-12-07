import { HtmlHTMLAttributes } from "react";
import styles from "./shimmer.module.css";

export function ShimmerLine({
  className,
}: HtmlHTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`${styles.Shimmer} ${className} block w-16 h-2 rounded `}
    ></span>
  );
}

export function ShimmerCircle({
  className,
}: HtmlHTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`${styles.Shimmer} block ${className} w-8 h-8 rounded-full overflow-hidden `}
    ></span>
  );
}

export function ShimmerLoader({
  className,
}: HtmlHTMLAttributes<HTMLSpanElement>) {
  return <span className={`${styles.Loader} ${className}`}></span>;
}
