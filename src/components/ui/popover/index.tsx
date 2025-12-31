import { HTMLAttributes } from "react";
import styles from "./index.module.css";

export function Popover({
  className,
  children,
  id,
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div id={id} popover="auto" className={`${className} ${styles.Popover}`}>
      {children}
    </div>
  );
}

export function PopoverHeader({
  className,
  children,
  id,
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <header className={`${styles.PopoverHeader} ${className} `}>
      {children}
    </header>
  );
}

export function PopoverContent({
  className,
  children,
  id,
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`${className} ${styles.PopoverContent}`}>{children}</div>
  );
}

export function PopoverFooter({
  className,
  children,
  id,
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <footer className={`${className} ${styles.PopoverFooter}`}>
      {children}
    </footer>
  );
}
