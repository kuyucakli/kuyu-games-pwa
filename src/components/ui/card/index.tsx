import { HtmlHTMLAttributes, PropsWithChildren } from "react";

function Card({
  children,
}: PropsWithChildren<HtmlHTMLAttributes<HTMLDivElement>>) {
  return <div>{children}</div>;
}

function CardHeader({
  children,
}: PropsWithChildren<HtmlHTMLAttributes<HTMLDivElement>>) {
  return <header>{children}</header>;
}

function CardTitle({
  children,
}: PropsWithChildren<HtmlHTMLAttributes<HTMLHeadingElement>>) {
  return <h1 className="text-3xl">{children}</h1>;
}

function CardDescription({
  children,
}: PropsWithChildren<HtmlHTMLAttributes<HTMLHeadingElement>>) {
  return <p className="text-sm">{children}</p>;
}

function CardContent({
  children,
}: PropsWithChildren<HtmlHTMLAttributes<HTMLDivElement>>) {
  return <div>{children}</div>;
}

function CardFooter({
  children,
}: PropsWithChildren<HtmlHTMLAttributes<HTMLDivElement>>) {
  return <footer>{children}</footer>;
}

function CardActions({
  children,
}: PropsWithChildren<HtmlHTMLAttributes<HTMLDivElement>>) {
  return <div>{children}</div>;
}

export { Card, CardActions, CardHeader, CardTitle, CardContent, CardFooter };
