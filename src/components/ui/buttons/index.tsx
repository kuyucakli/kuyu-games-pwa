"use client";

import {
  ButtonHTMLAttributes,
  LinkHTMLAttributes,
  PropsWithChildren,
} from "react";
import styles from "./buttons.module.css";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { ShimmerLoader } from "../shimmer";
export function Button({
  type,
  className,
  children,
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  const { pending } = useFormStatus();
  return (
    <button
      type={type}
      className={`${styles.Button} ${className}`}
      disabled={pending}
    >
      <span className={styles.ButtonContent}>
        <span className={styles.LoaderIconContainer}>
          {pending && <ShimmerLoader />}
        </span>
        <span className={styles.ButtonText}>{children}</span>
      </span>
    </button>
  );
}

export function LinkButton({
  href,
  className,
  children,
}: PropsWithChildren<LinkHTMLAttributes<HTMLLinkElement>>) {
  if (!href) {
    throw new Error("Button link needs href value.");
  }
  return (
    <Link href={href} className={`${styles.LinkButton} ${className}`}>
      {children}
    </Link>
  );
}
