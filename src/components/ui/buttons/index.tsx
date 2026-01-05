"use client";

import {
  ButtonHTMLAttributes,
  HTMLAttributes,
  LinkHTMLAttributes,
  PropsWithChildren,
  ReactElement,
} from "react";
import styles from "./buttons.module.css";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { ShimmerLoader } from "../shimmer";
import { FancyArrow } from "../fancy-arrow";

type BaseButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement>
> & {
  icon?: ReactElement<SVGElement>;
};
type BaseLinkButtonProps = PropsWithChildren<
  LinkHTMLAttributes<HTMLLinkElement>
>;

export function Button({
  icon,
  type = "button",
  className,
  children,
}: BaseButtonProps) {
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

export function ButtonRounded(props: BaseButtonProps) {
  const { children, className, ...restProps } = props;
  return (
    <Button {...restProps} className={`${className} ${styles.ButtonRounded}`}>
      {children}
    </Button>
  );
}

export function LinkButton({ href, className, children }: BaseLinkButtonProps) {
  if (!href) {
    throw new Error("Button link needs href value.");
  }
  return (
    <Link href={href} className={`${styles.LinkButton} ${className}`}>
      {children}
    </Link>
  );
}

export function LinkButtonRounded(props: BaseLinkButtonProps) {
  const { children, ...restProps } = props;
  return (
    <LinkButton {...restProps} className={styles.LinkButtonRounded}>
      {children}
    </LinkButton>
  );
}

export function LinkButtonArtistic(props: BaseLinkButtonProps) {
  return (
    <LinkButton
      {...props}
      className={`${styles.LinkButtonArtistic} text-md relative border-2 border-white`}
    >
      <FancyArrow className="absolute! top-1/2 -translate-y-1/2 left-4" />
      {props.children}
    </LinkButton>
  );
}

export function TextLink({ href, className, children }: BaseLinkButtonProps) {
  if (!href) {
    throw new Error("Text link needs href value.");
  }
  return (
    <Link href={href} className={`text-sm text-neutral-400  ${className}`}>
      {children}
    </Link>
  );
}
