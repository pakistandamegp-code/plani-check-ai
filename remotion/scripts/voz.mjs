// Genera la narración (TTS) y el archivo de guion con tiempos por línea.
// Uso: bun scripts/voz.mjs [tutorial|movil]
import { GUIONES } from "./guiones.mjs";
import { mkdir, writeFile, rm } from "fs/promises";
import { execFile } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(__dirname, "..");
const FPS = 30;
const ENTRADA = 18; // frames antes de la primera línea
const PAUSA_LINEA = 12;
const PAUSA_ESCENA = 22;
const COLA = 40;

const run = (cmd, args) =>
  new Promise((res, rej) =>
    execFile(cmd, args, { maxBuffer: 1 << 26 }, (e, so, se) => (e ? rej(new Error(se || e.message)) : res(so))),
  );

const dur = async (f) =>
  parseFloat((await run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f])).trim());

import { createHash } from "crypto";
import { existsSync, copyFileSync } from "fs";
const CACHE = "/tmp/voz-cache";
await mkdir(CACHE, { recursive: true });

async function tts(texto, destino) {
  const clave = path.join(CACHE, createHash("sha1").update("onyx|" + texto).digest("hex") + ".mp3");
  if (existsSync(clave)) { copyFileSync(clave, destino); return; }
  for (let intento = 0; intento < 8; intento++) {
    const r = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini-tts",
        voice: "onyx",
        input: texto,
        instructions:
          "Habla en español latinoamericano neutro, tono profesional y calmado, ritmo pausado y claro, como una narración institucional explicativa.",
      }),
    });
    if (r.ok) {
      const buf = Buffer.from(await r.arrayBuffer());
      await writeFile(clave, buf);
      await writeFile(destino, buf);
      return;
    }
    if (intento === 7) throw new Error(`TTS ${r.status}: ${await r.text()}`);
    await new Promise((s) => setTimeout(s, 4000 * (intento + 1)));
  }
}

async function construir(nombre) {
  const g = GUIONES[nombre];
  const tmp = path.join("/tmp", `voz-${nombre}`);
  await mkdir(tmp, { recursive: true });

  // 1. TTS por línea
  const piezas = [];
  let i = 0;
  for (const esc of g.escenas) {
    for (const texto of esc.lineas) {
      const f = path.join(tmp, `l${String(i).padStart(3, "0")}.mp3`);
      await tts(texto, f);
      const wav = f.replace(".mp3", ".wav");
      await run("ffmpeg", ["-y", "-i", f, "-ar", "44100", "-ac", "2", wav]);
      piezas.push({ escena: esc.id, texto, wav, seg: await dur(wav) });
      process.stdout.write(".");
      i++;
    }
  }
  process.stdout.write("\n");

  // 2. Tiempos + silencios
  const silencios = new Map();
  const silencio = async (frames) => {
    if (frames <= 0) return null;
    if (!silencios.has(frames)) {
      const f = path.join(tmp, `sil${frames}.wav`);
      await run("ffmpeg", [
        "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
        "-t", (frames / FPS).toFixed(3), f,
      ]);
      silencios.set(frames, f);
    }
    return silencios.get(frames);
  };

  const orden = [];
  const escenas = [];
  let cursor = 0;
  const push = async (frames) => {
    const s = await silencio(frames);
    if (s) orden.push(s);
    cursor += frames;
  };

  await push(ENTRADA);
  let k = 0;
  for (const [ie, esc] of g.escenas.entries()) {
    if (ie > 0) await push(PAUSA_ESCENA);
    const inicioEscena = cursor;
    const lineas = [];
    for (let il = 0; il < esc.lineas.length; il++) {
      if (il > 0) await push(PAUSA_LINEA);
      const p = piezas[k++];
      const frames = Math.round(p.seg * FPS);
      lineas.push({ texto: p.texto, inicio: cursor, dur: frames });
      orden.push(p.wav);
      cursor += frames;
    }
    escenas.push({ id: esc.id, inicio: inicioEscena, dur: cursor - inicioEscena, lineas });
  }
  const total = cursor + COLA;

  // 3. Concatenar audio
  const lista = path.join(tmp, "lista.txt");
  await writeFile(lista, orden.map((f) => `file '${f}'`).join("\n"));
  const salidaAudio = path.join(raiz, "public", g.audio);
  await mkdir(path.dirname(salidaAudio), { recursive: true });
  await run("ffmpeg", ["-y", "-f", "concat", "-safe", "0", "-i", lista, "-c:a", "libmp3lame", "-b:a", "160k", salidaAudio]);

  // 4. Guion
  const ts = `// Generado automáticamente. No editar a mano.
export type LineaGuion = { texto: string; inicio: number; dur: number };
export type EscenaGuion = { id: string; inicio: number; dur: number; lineas: LineaGuion[] };

export const AUDIO = "${g.audio}";
export const TOTAL = ${total};
export const ESCENAS: EscenaGuion[] = ${JSON.stringify(escenas, null, 2)};

export const escena = (id: string): EscenaGuion => {
  const e = ESCENAS.find((x) => x.id === id);
  if (!e) throw new Error("escena desconocida: " + id);
  return e;
};
`;
  await writeFile(path.join(raiz, g.salida), ts);
  console.log(`${nombre}: ${total} frames (${(total / FPS).toFixed(1)}s) -> ${g.salida}`);
}

const objetivo = process.argv[2];
for (const nombre of objetivo ? [objetivo] : Object.keys(GUIONES)) await construir(nombre);
