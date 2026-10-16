"use client";

import { useEffect, useRef } from "react";

// Looping invitation motion (rendered from motion/invite-motion.html with `pnpm motion:render`).
// Muted + playsInline lets it autoplay on phones; people who prefer reduced motion get the poster.
export function InviteVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (video && window.matchMedia("(prefers-reduced-motion: reduce)").matches) video.pause();
  }, []);

  return (
    <video
      ref={ref}
      className="block aspect-[720/934] w-full border-b border-line bg-[#fbe6ec] object-cover"
      src="/video/invite.mp4"
      poster="/video/invite-poster.jpg"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      aria-label="Convite animado: o primeiro aninho de Manuela"
    />
  );
}
