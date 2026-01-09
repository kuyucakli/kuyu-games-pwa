import { HtmlHTMLAttributes, PropsWithChildren } from "react";
import styles from "./index.module.css";

function GlassCard({
  children,
}: PropsWithChildren<HtmlHTMLAttributes<HTMLDivElement>>) {
  return <div className={styles.GlassCard}>{children}</div>;
}

function Card({
  className,
  children,
}: PropsWithChildren<HtmlHTMLAttributes<HTMLDivElement>>) {
  return <div className={`${styles.Card} ${className}`}>{children}</div>;
}

function CardHeader({
  children,
  className,
}: PropsWithChildren<HtmlHTMLAttributes<HTMLDivElement>>) {
  return <header className={`${className}`}>{children}</header>;
}

function CardTitle({
  children,
  className,
}: PropsWithChildren<HtmlHTMLAttributes<HTMLHeadingElement>>) {
  return (
    <h1
      className={`${styles.CardTitle} ${className} text-5xl mb-2 text-center`}
    >
      {children}
    </h1>
  );
}

function CardDescription({
  children,
}: PropsWithChildren<HtmlHTMLAttributes<HTMLHeadingElement>>) {
  return <p className="text-sm">{children}</p>;
}

function CardContent({
  children,
}: PropsWithChildren<HtmlHTMLAttributes<HTMLDivElement>>) {
  return <div className={styles.CardContent}>{children}</div>;
}

function CardFooter({
  children,
}: PropsWithChildren<HtmlHTMLAttributes<HTMLDivElement>>) {
  return <footer className={styles.CardFooter}>{children}</footer>;
}

function CardActions({
  children,
}: PropsWithChildren<HtmlHTMLAttributes<HTMLDivElement>>) {
  return <div>{children}</div>;
}

export {
  Card,
  CardActions,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
  GlassCard,
};
