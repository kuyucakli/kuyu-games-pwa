import { PWAInstallBanner } from "@/components/features/banners/pwa-banner";
import { PushMessage } from "@/components/features/notifications/push-message";
import { LinkButton } from "@/components/ui/buttons";

export default function HomePage() {
  return (
    <>
      <nav>
        <LinkButton href="/pinball">Pinball</LinkButton>
        <LinkButton href="/tahterevalli">Tahterevalli</LinkButton>
        <PWAInstallBanner />
        <PushMessage />
      </nav>
    </>
  );
}
