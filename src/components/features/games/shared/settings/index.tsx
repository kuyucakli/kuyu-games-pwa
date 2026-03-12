"use client";

import { threeAudioEngine } from "@/audio/three-audio-engine";
import { ButtonDefault } from "@/components/ui/buttons";
import { Switch } from "@/components/ui/switch";
import { useAudioSession } from "@/store/audio-session";
import { useGameSettings } from "@/store/game-settings";

export function Settings() {
  const muted = useAudioSession((state) => state.muted);
  const setMuted = useAudioSession((state) => state.setMuted);
  const { tiltEnabled, setTiltEnabled, requestTiltPermission } =
    useGameSettings((state) => state);

  const handleAudioToggle = async () => {
    threeAudioEngine.unlock();
    threeAudioEngine.setMuted(!muted);
    setMuted(!muted);
  };

  const handleTiltPermission = async () => {
    if (tiltEnabled) {
      setTiltEnabled(false);
      return;
    }

    await requestTiltPermission();
  };

  return (
    <>
      {isTouchDevice() && (
        <ButtonDefault
          icon={
            <span
              className={`relative border border-neutral-300 flex w-6 h-3.5 rounded-md`}
            >
              <Switch
                id="tilt-permission"
                checked={tiltEnabled}
                className={`${tiltEnabled ? "opacity-80" : ""} w-3 h-3 `}
                asChild={true}
              />
            </span>
          }
          onClick={handleTiltPermission}
        >
          <span>Use device tilt</span>
        </ButtonDefault>
      )}
      <ButtonDefault
        icon={
          <span
            className={` relative border border-neutral-300 flex w-6 h-3.5 rounded-md`}
          >
            <Switch
              id="audio"
              checked={!muted}
              className={`${muted ? "opacity-80" : ""}  w-3 h-3`}
              asChild={true}
            />
          </span>
        }
        onClick={handleAudioToggle}
      >
        <span className="text-md">{muted ? "Unmute" : "Mute"} audio </span>
      </ButtonDefault>
    </>
  );
}

export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;

  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    // iOS Safari edge case
    (navigator as any).msMaxTouchPoints > 0
  );
}
