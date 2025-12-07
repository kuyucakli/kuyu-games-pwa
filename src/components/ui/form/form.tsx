"use client";
import { HTMLAttributes, PropsWithChildren } from "react";
import styles from "./form.module.css";

export function Form({
  id,
  className,
  children,
  action,
}: PropsWithChildren<HTMLAttributes<HTMLFormElement>> & {
  action: (payload: FormData) => void;
}) {
  return (
    <form
      id={`${id}`}
      className={`${styles.Form} ${className}`}
      action={action}
      noValidate
    >
      {children}
    </form>
  );
}
