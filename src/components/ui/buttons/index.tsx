"use client";

import {
  ButtonHTMLAttributes,
  LinkHTMLAttributes,
  PropsWithChildren,
  ReactElement,
} from "react";
import styles from "./buttons.module.css";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { ShimmerLoader } from "../shimmer";
import { FancyArrow } from "../fancy-arrow";
export function Button({
  icon,
  type,
  className,
  children,
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  icon?: ReactElement<SVGElement>;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type={type}
      className={`${styles.Button} ${className}`}
      disabled={pending}
    >
      {icon}
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

export function LinkButtonArtistic(
  props: PropsWithChildren<LinkHTMLAttributes<HTMLLinkElement>>
) {
  return (
    <LinkButton
      {...props}
      className={`${styles.LinkButtonArtistic} text-2xl text-blue-600 relative`}
    >
      <FancyArrow className="absolute! top-1/2 -translate-y-1/2 left-16" />
      {props.children}
    </LinkButton>
  );
}

export function TextLink({
  href,
  className,
  children,
}: PropsWithChildren<LinkHTMLAttributes<HTMLLinkElement>>) {
  if (!href) {
    throw new Error("Text link needs href value.");
  }
  return (
    <Link href={href} className={`text-sm text-neutral-400  ${className}`}>
      {children}
    </Link>
  );
}
