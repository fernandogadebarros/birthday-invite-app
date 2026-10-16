import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { ageLabel, event, ogDescription, ogTitle } from "@/lib/event";

export const alt = ogTitle();
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const root = process.cwd();
const minnie = `data:image/png;base64,${await readFile(join(root, "public/images/minnie-cutout.png"), "base64")}`;
const greatVibes = await readFile(join(root, "assets/fonts/GreatVibes-Regular.ttf"));
const fredokaSemiBold = await readFile(join(root, "assets/fonts/Fredoka-SemiBold.ttf"));
const fredokaMedium = await readFile(join(root, "assets/fonts/Fredoka-Medium.ttf"));

// Invite art for the WhatsApp link preview, based on the page hero.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#f45d9e",
          backgroundImage: "radial-gradient(#fff 16%, transparent 17%), radial-gradient(#fff 16%, transparent 17%)",
          backgroundSize: "56px 56px",
          backgroundPosition: "0 0, 28px 28px",
          borderBottom: "12px solid #1d1418",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 0 0 80px", width: 760 }}>
          <span
            style={{
              fontFamily: "Great Vibes",
              fontSize: 180,
              lineHeight: 1,
              color: "#fff",
              textShadow: "0 4px 0 rgba(29,20,24,.45)",
            }}
          >
            {event.celebrant.name}
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 24,
              padding: "10px 32px 10px 10px",
              borderRadius: 999,
              background: "#fff",
              alignSelf: "flex-start",
              boxShadow: "6px 6px 0 #1d1418",
              fontFamily: "Fredoka",
              fontWeight: 600,
              fontSize: 40,
              color: "#1d1418",
            }}
          >
            <span
              style={{
                width: 64,
                height: 64,
                borderRadius: 999,
                background: "#1d1418",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {event.celebrant.age}
            </span>
            {ageLabel()}
          </div>
          <span
            style={{
              marginTop: 36,
              padding: "12px 24px",
              borderRadius: 999,
              background: "#1d1418",
              color: "#fff",
              alignSelf: "flex-start",
              fontFamily: "Fredoka",
              fontWeight: 500,
              fontSize: 30,
            }}
          >
            {ogDescription()}
          </span>
        </div>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={minnie} height={590} width={295} style={{ position: "absolute", right: 120, bottom: 4 }} />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Great Vibes", data: greatVibes, style: "normal", weight: 400 },
        { name: "Fredoka", data: fredokaSemiBold, style: "normal", weight: 600 },
        { name: "Fredoka", data: fredokaMedium, style: "normal", weight: 500 },
      ],
    },
  );
}
