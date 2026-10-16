import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { event, ogTitle } from "@/lib/event";

export const alt = ogTitle();
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const root = process.cwd();
const minnie = `data:image/png;base64,${await readFile(join(root, "assets/og-minnie.png"), "base64")}`;
const greatVibes = await readFile(join(root, "assets/fonts/GreatVibes-Regular.ttf"));
const cormorant = await readFile(join(root, "assets/fonts/CormorantGaramond-Medium.ttf"));

const GOLD = "#b8893a";
const ROSE = "#c8507e";
const INK = "#4a2a36";

const balloons = [
  { left: 36, top: 470, w: 52, from: "#f7b6cc", to: "#d9608f" },
  { left: 1010, top: 60, w: 100, from: "#f3dca4", to: GOLD },
  { left: 1080, top: 300, w: 70, from: "#f7b6cc", to: "#d9608f" },
  { left: 930, top: 270, w: 62, from: "#fde9f0", to: "#e9a7c0" },
];

// Static card for link previews (WhatsApp and others), mirroring the invite motion.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundImage: "radial-gradient(ellipse at 50% 38%, #fff7f9 0%, #fbe6ec 45%, #f4c6d4 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 22,
            top: 22,
            right: 22,
            bottom: 22,
            border: `2px solid ${GOLD}`,
            opacity: 0.7,
            display: "flex",
          }}
        />
        {balloons.map((b) => (
          <div key={b.left} style={{ position: "absolute", left: b.left, top: b.top, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                width: b.w,
                height: b.w * 1.18,
                borderRadius: "50%",
                backgroundImage: `radial-gradient(circle at 32% 28%, #fff 0%, ${b.from} 22%, ${b.to} 100%)`,
              }}
            />
            <div style={{ width: 2, height: b.w * 1.1, backgroundImage: "linear-gradient(#e2c27a, rgba(184,137,58,0))" }} />
          </div>
        ))}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 0 0 90px", width: 760 }}>
          <span style={{ fontFamily: "Cormorant", fontSize: 28, letterSpacing: "0.4em", textTransform: "uppercase", color: INK, marginLeft: 8 }}>
            o primeiro aninho de
          </span>
          <span
            style={{
              fontFamily: "Great Vibes",
              fontSize: 190,
              lineHeight: 1.1,
              color: GOLD,
            }}
          >
            {event.celebrant.name}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginLeft: 10, marginTop: -6 }}>
            <span style={{ width: 70, height: 2, background: GOLD }} />
            <span style={{ fontFamily: "Cormorant", fontSize: 48, color: ROSE, letterSpacing: "0.06em" }}>1 ano</span>
            <span style={{ width: 70, height: 2, background: GOLD }} />
          </div>
          <span style={{ fontFamily: "Great Vibes", fontSize: 92, color: ROSE, marginTop: 30, marginLeft: 6 }}>Espero você!</span>
        </div>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={minnie} height={430} width={271} style={{ position: "absolute", right: 130, bottom: 50 }} />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Great Vibes", data: greatVibes, style: "normal", weight: 400 },
        { name: "Cormorant", data: cormorant, style: "normal", weight: 500 },
      ],
    },
  );
}
