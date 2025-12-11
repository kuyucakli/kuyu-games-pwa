"use client";
import { HTMLAttributes, PropsWithChildren, ReactNode } from "react";
import styles from "./form.module.css";

export function Form({
  id,
  className,
  children,
  action,
  onSubmit,
}: PropsWithChildren<HTMLAttributes<HTMLFormElement>> & {
  action?: (payload: FormData) => void;
}) {
  return (
    <form
      id={`${id}`}
      className={`${styles.Form} ${className}`}
      action={action}
      noValidate
      onSubmit={onSubmit}
    >
      {children}
    </form>
  );
}

export function FormFooter({ children }: { children: ReactNode }) {
  return <footer className={styles.FormFooter}>{children}</footer>;
}
