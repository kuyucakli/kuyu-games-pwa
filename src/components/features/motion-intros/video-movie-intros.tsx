import { type HTMLAttributes, useEffect, useRef, useState } from "react";
import { VIDEO_CONFIG } from "@/games/tahterevallis/config";

export function VideoMovieIntros({
  playMarker = "intro",
  className,
}: HTMLAttributes<HTMLVideoElement> & {
  playMarker?: keyof typeof VIDEO_CONFIG;
}) {
  const videoElRef = useRef<HTMLVideoElement | null>(null);
  const [activeMarker, setActiveMarker] = useState(playMarker);

  // Sync internal state with prop changes (e.g. if parent forces "gameOver")
  useEffect(() => {
    setActiveMarker(playMarker);
  }, [playMarker]);

  useEffect(() => {
    const video = videoElRef.current;
    if (!video) return;
    const config = VIDEO_CONFIG[activeMarker];
    const startPos = config.start;
    video.currentTime = startPos;
    video.addEventListener("timeupdate", () => {
      //   const startPos = config.start;
      //   video.currentTime = startPos;

      if (video.currentTime >= config.end) {
        if (config.loop) {
          // Instant loop back to start of section
          video.currentTime = config.start;
        } else {
          video.pause();
        }
      }
    });
  }, [activeMarker]);

  return (
    <video
      ref={videoElRef}
      autoPlay
      playsInline
      muted
      //   loop
      className={`fixed border-2 w-full h-full object-cover mix-blend-color-dodge ${className}`}
    >
      <source
        src="/assets/tahterevallis/videos/ball-rolling-movie-inside-the-game.mp4"
        type="video/mp4"
      />
    </video>
  );
}
