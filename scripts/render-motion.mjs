// Renders motion/invite-motion.html into public/video/invite.mp4 (+ poster).
//   pnpm motion:render
// Needs `ffmpeg` in PATH (or FFMPEG=/path/to/ffmpeg) and network access for Google Fonts.
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const FPS = 30;
const WIDTH = 720; // output width; the design canvas is 1080x1400
const HEIGHT = 2 * Math.round((WIDTH * 1400) / 1080 / 2); // H.264 needs even dimensions
const POSTER_AT = 8.5; // seconds
const root = resolve(import.meta.dirname, "..");
const out = join(root, "public/video");
const ffmpeg = process.env.FFMPEG ?? "ffmpeg";
const frames = mkdtempSync(join(tmpdir(), "motion-"));

mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
  });
  await page.goto(pathToFileURL(join(root, "motion/invite-motion.html")).href);
  await page.evaluate(() => window.ready);
  await page.evaluate((w) => window.fitTo(w), WIDTH);

  const total = await page.evaluate(() => window.TOTAL);
  const count = Math.round(total * FPS);
  for (let i = 0; i < count; i++) {
    await page.evaluate((t) => window.renderFrame(t), i / FPS);
    await page.screenshot({
      path: join(frames, `${String(i).padStart(4, "0")}.jpg`),
      type: "jpeg",
      quality: 92,
    });
    if (i % 60 === 0) console.log(`frame ${i}/${count}`);
  }
  await page.evaluate((t) => window.renderFrame(t), POSTER_AT);
  await page.screenshot({
    path: join(out, "invite-poster.jpg"),
    type: "jpeg",
    quality: 85,
  });
} finally {
  await browser.close();
}

try {
  execFileSync(
    ffmpeg,
    [
      "-y",
      "-loglevel",
      "error",
      "-framerate",
      String(FPS),
      "-i",
      join(frames, "%04d.jpg"),
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-crf",
      "27",
      "-preset",
      "slow",
      "-movflags",
      "+faststart",
      "-an",
      join(out, "invite.mp4"),
    ],
    { stdio: "inherit" },
  );
} finally {
  rmSync(frames, { recursive: true, force: true });
}
console.log("done: public/video/invite.mp4");
