// PixelLift 画像アセット生成スクリプト（Pollinations.ai / 無料・キー不要）
//
// 使い方:
//   npm run gen:sprites              … 既定セット（hero-front, hero-back, stage-bg）
//   npm run gen:sprites -- hero-front
//   npm run gen:sprites -- stage-bg
//   npm run gen:sprites -- all       … 登録済み全部
//
// 生成物は assets/<name>.png。透過が要るもの(cut:true)は白背景を四隅から自動で抜く。
// 生成後 src/sprites.ts の該当キーを require(...) に自動で書き換える。Expo Go で Reload。

import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import jpeg from 'jpeg-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ASSETS = path.join(ROOT, 'assets');
const SPRITES_TS = path.join(ROOT, 'src', 'sprites.ts');

const PIXEL = `Classic 16-bit Dragon Quest / Final Fantasy SNES pixel-art style, bold solid
black outline, limited warm palette, flat cel shading lit from top-left, crisp blocky pixels`;
const WHITE_BG = `SOLID FLAT PURE WHITE (#FFFFFF) background, character centered with wide empty
margin, no ground shadow, no text, no frame.`;

// name -> { prompt, cut, w, h, sprite }（sprite=sprites.ts のキー名）
const ASSETS_CONFIG = {
  'hero-front': {
    sprite: 'front', cut: true, w: 1024, h: 1024,
    prompt: `Muscular male fitness trainer hero, front view, standing idle, arms slightly
away from body, short dark hair, bare muscular torso with clear muscle groups
(pecs, deltoids, biceps, six-pack abs, quads), blue gym shorts, brown boots, full body.
${PIXEL}, ${WHITE_BG}`,
  },
  'hero-back': {
    sprite: 'back', cut: true, w: 1024, h: 1024,
    prompt: `Muscular male fitness trainer hero, BACK view, standing idle, short dark hair,
visible back muscles (lats, traps, lower back), glutes and hamstrings, blue gym shorts,
brown boots, full body. ${PIXEL}, ${WHITE_BG}`,
  },
  'stage-bg': {
    sprite: 'stageBg', cut: false, w: 768, h: 1024,
    prompt: `16-bit JRPG overworld scenery background, vertical composition. Night sky with
stars and a glowing moon, distant fantasy castle silhouette on a hill, pine tree forest,
grassy clearing in the foreground, cozy adventure atmosphere. ${PIXEL}. No characters,
no people, no text, no UI, no frame.`,
  },
  'slime': {
    sprite: 'slime', cut: true, w: 1024, h: 1024,
    prompt: `Cute blue slime mascot, classic JRPG slime with a friendly smiling face,
single character, full body. ${PIXEL}, ${WHITE_BG}`,
  },
};

async function fetchImage(name, cfg, attempt = 1) {
  const seed = Math.floor(Math.random() * 1e9);
  const url =
    `https://image.pollinations.ai/prompt/${encodeURIComponent(cfg.prompt)}` +
    `?width=${cfg.w}&height=${cfg.h}&model=flux&nologo=true&seed=${seed}`;
  process.stdout.write(`🎨 ${name} を生成中 (試行 ${attempt})... `);
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'pixellift-gen' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 2000) throw new Error('画像が小さすぎる（生成失敗の可能性）');
    console.log('受信OK');
    return buf;
  } catch (e) {
    console.log(`失敗: ${e.message}`);
    if (attempt >= 4) throw new Error(`${name} の生成に4回失敗。時間をおいて再試行を。`);
    await new Promise((r) => setTimeout(r, 2500 * attempt));
    return fetchImage(name, cfg, attempt + 1);
  }
}

function decode(buf) {
  if (buf[0] === 0x89 && buf[1] === 0x50) {
    const png = PNG.sync.read(buf);
    return { width: png.width, height: png.height, data: png.data };
  }
  const img = jpeg.decode(buf, { useTArray: true, formatAsRGBA: true });
  return { width: img.width, height: img.height, data: Buffer.from(img.data) };
}

function removeWhiteBackground({ width, height, data }, tol = 38) {
  const isWhite = (i) => data[i] > 255 - tol && data[i + 1] > 255 - tol && data[i + 2] > 255 - tol;
  const visited = new Uint8Array(width * height);
  const stack = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const p = y * width + x;
    if (visited[p]) return;
    visited[p] = 1;
    if (isWhite(p * 4)) stack.push(p);
  };
  for (let x = 0; x < width; x++) { push(x, 0); push(x, height - 1); }
  for (let y = 0; y < height; y++) { push(0, y); push(width - 1, y); }
  while (stack.length) {
    const p = stack.pop();
    data[p * 4 + 3] = 0;
    const x = p % width, y = (p / width) | 0;
    push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
  }
  return { width, height, data };
}

async function makeAsset(name) {
  const cfg = ASSETS_CONFIG[name];
  if (!cfg) { console.error(`❌ 未知のアセット: ${name}（${Object.keys(ASSETS_CONFIG).join(', ')}）`); process.exit(1); }
  const raw = await fetchImage(name, cfg);
  const img = decode(raw);
  const final = cfg.cut ? removeWhiteBackground(img) : img;
  const out = new PNG({ width: final.width, height: final.height });
  final.data.copy(out.data);
  if (!existsSync(ASSETS)) await mkdir(ASSETS, { recursive: true });
  const file = path.join(ASSETS, `${name}.png`);
  await writeFile(file, PNG.sync.write(out));
  console.log(`✅ ${path.relative(ROOT, file)} を保存${cfg.cut ? '（背景透過済み）' : ''}`);
  return cfg.sprite;
}

async function enableInSprites(pairs) {
  let src = await readFile(SPRITES_TS, 'utf8');
  for (const { name, key } of pairs) {
    const re = new RegExp(`(${key}:\\s*)(null|require\\([^)]*\\))`);
    src = src.replace(re, `$1require('../assets/${name}.png')`);
  }
  await writeFile(SPRITES_TS, src);
  console.log('✅ src/sprites.ts を有効化しました');
}

const arg = process.argv[2];
let targets;
if (!arg) targets = ['hero-front', 'hero-back', 'stage-bg'];
else if (arg === 'all') targets = Object.keys(ASSETS_CONFIG);
else targets = [arg];

const pairs = [];
for (const t of targets) pairs.push({ name: t, key: await makeAsset(t) });
await enableInSprites(pairs);
console.log('\n🎉 完了。Expo Go でアプリを Reload してください。');
