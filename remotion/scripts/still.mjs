import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const id = process.argv[2] ?? "main";
const frames = (process.argv[3] ?? "0").split(",").map(Number);

const serveUrl = await bundle({ entryPoint: path.resolve(__dirname, "../src/index.ts"), webpackOverride: (c) => c });
const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});
const composition = await selectComposition({ serveUrl, id, puppeteerInstance: browser });
for (const frame of frames) {
  await renderStill({
    composition,
    serveUrl,
    frame,
    output: `/tmp/still-${id}-${frame}.png`,
    puppeteerInstance: browser,
    overwrite: true,
  });
  console.log("still", frame);
}
await browser.close({ silent: false });
