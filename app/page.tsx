import { PushMessage } from "@/components/features/notifications/push-message";
import Link from "next/link";

export default function HomePage() {
  return (
    <nav>
      <Link href="/pinball" className="border-1 border-rose-100 size-24 block">
        Pinball
      </Link>
      <Link
        href="/tahterevalli"
        className="border-1 border-rose-100 size-24 block"
      >
        Tahterevalli
      </Link>
      <PushMessage />
    </nav>
  );
}
