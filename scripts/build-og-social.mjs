import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const root = process.cwd();
const publicDir = path.join(root, "public");
const scriptAssetsDir = path.join(root, "scripts", "assets");

const toDataUrl = async (filename, mime, directory = publicDir) => {
  const file = await fs.readFile(path.join(directory, filename));
  return `data:${mime};base64,${file.toString("base64")}`;
};

const [background, logo] = await Promise.all([
  toDataUrl("og-vello-background-v2.png", "image/png", scriptAssetsDir),
  toDataUrl("vello-logo.png", "image/png"),
]);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });

await page.setContent(`<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap" />
    <style>
      * { box-sizing: border-box; }
      html, body { width: 1200px; height: 630px; margin: 0; overflow: hidden; }
      body { color: #12283A; background: #F7FAFD; font-family: Inter, system-ui, sans-serif; }
      .card { position: relative; width: 1200px; height: 630px; overflow: hidden; background: #F7FAFD; }
      .art { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
      .veil { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(247,250,253,.98) 0%, rgba(247,250,253,.95) 35%, rgba(247,250,253,.48) 56%, rgba(247,250,253,0) 78%); }
      .frame { position: absolute; inset: 18px; border: 1px solid rgba(122,157,183,.26); border-radius: 30px; box-shadow: inset 0 1px 0 rgba(255,255,255,.82); }
      .content { position: absolute; inset: 0; display: flex; flex-direction: column; width: 625px; padding: 62px 0 54px 72px; }
      .brand { display: flex; align-items: center; gap: 14px; }
      .brand img { width: 50px; height: 50px; object-fit: contain; }
      .brand span { font: 600 34px/1 "Inter Tight", Inter, sans-serif; letter-spacing: -.035em; }
      .eyebrow { margin-top: 58px; font: 500 13px/1 "JetBrains Mono", monospace; letter-spacing: .14em; color: #3A739C; }
      h1 { margin: 17px 0 0; max-width: 560px; font: 500 64px/.96 "Inter Tight", Inter, sans-serif; letter-spacing: -.055em; }
      p { margin: 24px 0 0; max-width: 500px; font-size: 22px; line-height: 1.42; letter-spacing: -.015em; color: #4A5D6C; }
      .footer { display: flex; align-items: center; gap: 18px; margin-top: auto; }
      .pill { display: inline-flex; align-items: center; height: 44px; padding: 0 19px; border-radius: 999px; background: #7EAFD0; color: #12283A; font-weight: 600; font-size: 16px; box-shadow: 0 12px 24px -16px rgba(58,115,156,.8); }
      .url { font-size: 14px; font-weight: 500; color: #6B7E8D; }
      .dot { width: 5px; height: 5px; border-radius: 50%; background: #7EAFD0; }
    </style>
  </head>
  <body>
    <main class="card">
      <img class="art" src="${background}" alt="" />
      <div class="veil"></div>
      <div class="frame"></div>
      <section class="content">
        <div class="brand"><img src="${logo}" alt="" /><span>Vello</span></div>
        <div class="eyebrow">CATÁLOGO + AGENDA ONLINE</div>
        <h1>Sua estética com agenda cheia.</h1>
        <p>Sua cliente escolhe o serviço e o horário. A Vello organiza o resto.</p>
        <div class="footer">
          <span class="pill">Teste grátis por 7 dias</span>
          <span class="dot"></span>
          <span class="url">velloesteticas.vercel.app</span>
        </div>
      </section>
    </main>
  </body>
</html>`, { waitUntil: "networkidle" });

await page.evaluate(() => document.fonts.ready);
await page.screenshot({
  path: path.join(publicDir, "og-vello-social-v2.jpg"),
  type: "jpeg",
  quality: 94,
  animations: "disabled",
});

await browser.close();
console.log("public/og-vello-social-v2.jpg criado em 1200x630");
