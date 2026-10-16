// Renders the link-preview card (WhatsApp and others) into public/images/og-card.jpg.
//   pnpm og:render
// A JPEG keeps the photo sharp under WhatsApp's ~300 KB limit (a generated PNG would not).
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { chromium } from "@playwright/test";

const root = resolve(import.meta.dirname, "..");
const b64 = (path) => readFileSync(join(root, path)).toString("base64");
const GOLD = "#b8893a";

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:GV;src:url(data:font/ttf;base64,${b64("assets/fonts/GreatVibes-Regular.ttf")})}
@font-face{font-family:CG;src:url(data:font/ttf;base64,${b64("assets/fonts/CormorantGaramond-Medium.ttf")})}
body{margin:0}
#c{position:relative;width:1200px;height:630px;overflow:hidden;background:radial-gradient(ellipse at 50% 38%,#fff7f9 0%,#fbe6ec 45%,#f4c6d4 100%)}
#c>*,.p>*{position:absolute}
.balloon{display:flex;flex-direction:column;align-items:center}
.balloon i{display:block;border-radius:50%}
.balloon b{display:block;width:2px;background:linear-gradient(#e2c27a,rgba(184,137,58,0))}
</style><div id="c">
<div style="inset:22px;border:2px solid ${GOLD};opacity:.7"></div>
${[
  [36, 470, 52, "#f7b6cc", "#d9608f"],
  [1010, 60, 100, "#f3dca4", GOLD],
  [1080, 300, 70, "#f7b6cc", "#d9608f"],
  [930, 270, 62, "#fde9f0", "#e9a7c0"],
]
  .map(
    ([l, t, w, a, z]) =>
      `<div class="balloon" style="left:${l}px;top:${t}px"><i style="width:${w}px;height:${w * 1.18}px;background:radial-gradient(circle at 32% 28%,#fff 0,${a} 22%,${z} 100%)"></i><b style="height:${w * 1.1}px"></b></div>`,
  )
  .join("")}
<div style="left:90px;top:0;width:760px;height:630px;display:flex;flex-direction:column;justify-content:center">
  <div style="font:190px/1.1 GV;color:${GOLD}">Manuela</div>
  <div style="display:flex;align-items:center;gap:18px;margin:-6px 0 0 10px"><span style="width:70px;height:2px;background:${GOLD}"></span><span style="font:48px CG;color:#c8507e;letter-spacing:.06em">1 ano</span><span style="width:70px;height:2px;background:${GOLD}"></span></div>
  <div style="font:92px GV;color:${GOLD};margin:30px 0 0 6px">Espero você!</div>
</div>
<div class="p" style="right:112px;top:92px;width:340px;height:446px">
  <div style="inset:-18px;border:2px solid ${GOLD};border-radius:188px 188px 22px 22px"></div>
  <div style="inset:-8px;border:1px solid rgba(184,137,58,.5);border-radius:178px 178px 16px 16px"></div>
  <div style="inset:0;overflow:hidden;border-radius:170px 170px 12px 12px;box-shadow:0 18px 36px rgba(140,50,90,.25)">
    <img src="data:image/jpeg;base64,${b64("motion/manu.jpg")}" style="position:absolute;left:-9px;top:-130px;width:390px;height:693px">
  </div>
</div></div>`;

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(html);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(root, "public/images/og-card.jpg"), type: "jpeg", quality: 82 });
} finally {
  await browser.close();
}
console.log("done: public/images/og-card.jpg");
