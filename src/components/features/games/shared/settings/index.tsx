"use client";

import { threeAudioEngine } from "@/audio/three-audio-engine";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAudioSession } from "@/store/audio-session";
import { useGameSettings } from "@/store/game-settings";

export function Settings() {
  const muted = useAudioSession((state) => state.muted);
  const setMuted = useAudioSession((state) => state.setMuted);
  const { tiltEnabled, setTiltEnabled, tiltPermission, requestTiltPermission } =
    useGameSettings((state) => state);

  return (
    <div className={`flex flex-col gap-4`}>
      {isTouchDevice() && (
        <div className="flex items-center gap-3">
          <Checkbox
            id="enable-device-orientation"
            defaultChecked={tiltEnabled && tiltPermission === "granted"}
            onCheckedChange={async (checked) => {
              if (!checked) {
                setTiltEnabled(false);
                return;
              }

              await requestTiltPermission();
            }}
          />
          <Label htmlFor="enable-device-orientation">
            Enable device orientation detection
          </Label>
        </div>
      )}
      <div className={`${muted ? "opacity-60" : ""} flex items-start gap-3 `}>
        <Checkbox
          id="audio"
          checked={!muted}
          onCheckedChange={() => {
            threeAudioEngine.unlock();
            threeAudioEngine.setMuted(!muted);
            setMuted(!muted);
          }}
        />
        <Label htmlFor="audio">Audio {muted ? "off" : "on"}</Label>
      </div>
    </div>
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
