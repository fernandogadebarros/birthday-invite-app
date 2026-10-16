import Image from "next/image";
import type { CSSProperties } from "react";
import { ageLabel, event } from "@/lib/event";

// Positions, sizes and delays copied from heroFx() in the prototype.
const BALLOONS = [
  { left: "70%", top: "6%", width: 58, color: "#e0307a", delay: 0 },
  { left: "82%", top: "14%", width: 50, color: "#f5c84c", delay: 0.8 },
  { left: "84%", top: "44%", width: 40, color: "#ffffff", delay: 1.6 },
  { left: "4%", top: "40%", width: 40, color: "#f5c84c", delay: 1.1 },
  { left: "8%", top: "60%", width: 34, color: "#e0307a", delay: 2 },
];

const STARS = [
  { left: "58%", top: "8%", size: 18, delay: 0 },
  { left: "90%", top: "40%", size: 14, delay: 0.6 },
  { left: "8%", top: "36%", size: 16, delay: 1.2 },
  { left: "48%", top: "30%", size: 12, delay: 0.3 },
  { left: "92%", top: "62%", size: 18, delay: 1.8 },
  { left: "30%", top: "40%", size: 10, delay: 2.4 },
];

export function InviteHero() {
  return (
    <div className="bg-dots-hero relative aspect-[4/5] max-h-[640px] w-full animate-drift overflow-hidden border-b-4 border-ink bg-hero">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {BALLOONS.map((b, i) => (
          <div
            key={`balloon-${i}`}
            className="absolute flex origin-bottom flex-col items-center"
            style={{ left: b.left, top: b.top, animation: `bob ${3.2 + i * 0.4}s ease-in-out ${b.delay}s infinite` }}
          >
            <div
              style={{
                width: b.width,
                height: b.width * 1.2,
                borderRadius: "50% 50% 48% 52% / 58% 58% 42% 42%",
                background: b.color,
                border: "2px solid #1d1418",
                boxShadow: "inset -6px -8px 0 rgba(0,0,0,.08)",
              }}
            />
            <div className="-mt-px size-0 border-x-[5px] border-b-[6px] border-x-transparent border-b-ink" />
            <div className="w-[1.5px] bg-ink" style={{ height: b.width * 1.1 }} />
          </div>
        ))}
        {STARS.map((s, i) => (
          <span
            key={`star-${i}`}
            className="absolute text-gold-decor [text-shadow:0_0_1px_#1d1418]"
            style={{ left: s.left, top: s.top, fontSize: s.size, animation: `twinkle 2.2s ease-in-out ${s.delay}s infinite` } as CSSProperties}
          >
            ✦
          </span>
        ))}
      </div>

      <div className="absolute inset-x-[18%] bottom-[2%] h-[68%] origin-bottom animate-sway">
        <Image src="/images/minnie-cutout.png" alt="" fill priority sizes="(min-width: 960px) 340px, 64vw" className="object-contain" />
      </div>

      <div className="pointer-events-none absolute inset-x-[22px] top-[18px] flex animate-pop flex-col items-start">
        <span className="font-script text-84 leading-none text-white [text-shadow:0_2px_0_rgba(29,20,24,.45),0_0_18px_rgba(194,31,100,.35)]">
          {event.celebrant.name}
        </span>
        <span className="mt-2.5 flex items-center gap-2 rounded-full bg-white py-1.5 pr-4 pl-1.5 font-sans text-20 leading-none font-semibold text-ink shadow-sticker">
          <span className="flex size-[34px] items-center justify-center rounded-full bg-ink font-sans text-20 font-bold text-white">
            {event.celebrant.age}
          </span>
          {ageLabel()}
        </span>
      </div>
    </div>
  );
}
