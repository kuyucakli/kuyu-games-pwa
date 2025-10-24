import Link from "next/link";

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Link href="/">Home</Link>
      {children}
    </div>
  );
}
