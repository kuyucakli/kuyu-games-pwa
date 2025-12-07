"use client";

import { useInstallStore } from "@/store/use-pwa-install-store";
import { useBeforeInstallPrompt } from "@/hooks/use-before-install-prompt";

export function PWAInstallBanner() {
  const { isReady: isPromptInstallReady, promptInstall } =
    useBeforeInstallPrompt();
  const { dismissed, setDismissed } = useInstallStore();

  if (dismissed || !isPromptInstallReady) return null;

  const handleInstall = async () => {
    const choice = await promptInstall();
    setDismissed(true);
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white p-3 flex justify-between items-center z-50">
      <span>Install this app for offline use and notifications.</span>
      <div className="flex gap-2">
        <button
          onClick={handleInstall}
          className="bg-white text-blue-600 px-3 py-1 rounded"
        >
          Install
        </button>
        <button onClick={() => setDismissed(true)} className="px-3 py-1">
          Dismiss
        </button>
      </div>
    </div>
  );
}
