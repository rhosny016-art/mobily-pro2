// Generates public/og-image.png (1200x630) using only Node built-ins.
// Run with: node scripts/generate-og.mjs
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const W = 1200;
const H = 630;
const px = new Uint8Array(W * H * 4);

function set(i, r, g, b, a) {
  px[i] = r;
  px[i + 1] = g;
  px[i + 2] = b;
  px[i + 3] = a;
}

function blend(i, r, g, b, a) {
  const sa = a / 255;
  const da = px[i + 3] / 255;
  const oa = sa + da * (1 - sa);
  if (oa <= 0) return;
  px[i] = Math.round((r * sa + px[i] * da * (1 - sa)) / oa);
  px[i + 1] = Math.round((g * sa + px[i + 1] * da * (1 - sa)) / oa);
  px[i + 2] = Math.round((b * sa + px[i + 2] * da * (1 - sa)) / oa);
  px[i + 3] = Math.round(oa * 255);
}

const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
const lerp = (a, b, t) => a + (b - a) * t;

// Background: vertical night gradient
const cTop = [5, 8, 26];
const cBottom = [10, 16, 41];
for (let y = 0; y < H; y++) {
  const t = y / (H - 1);
  const r = lerp(cTop[0], cBottom[0], t);
  const g = lerp(cTop[1], cBottom[1], t);
  const b = lerp(cTop[2], cBottom[2], t);
  for (let x = 0; x < W; x++) set((y * W + x) * 4, r, g, b, 255);
}

// Radial brass glow behind the mark
function radialGlow(cx, cy, radius, peakAlpha) {
  for (let y = cy - radius; y < cy + radius; y++) {
    for (let x = cx - radius; x < cx + radius; x++) {
      if (x < 0 || x >= W || y < 0 || y >= H) continue;
      const d = Math.hypot(x - cx, y - cy) / radius;
      if (d > 1) continue;
      const a = peakAlpha * (1 - d) * (1 - d);
      blend((y * W + x) * 4, 247, 185, 85, clamp(a));
    }
  }
}
radialGlow(600, 300, 430, 130);
radialGlow(600, 300, 220, 60);

// Decorative dots
const DOTS = [
  [120, 130, 7, 90], [1080, 110, 6, 70], [180, 500, 5, 80], [1020, 500, 8, 70],
  [300, 90, 4, 60], [900, 560, 5, 60], [80, 330, 4, 50], [1120, 320, 4, 50],
  [560, 570, 3, 45], [640, 60, 3, 45],
];
for (const [cx, cy, rad, alpha] of DOTS) radialGlow(cx, cy, rad, alpha);

// Diamond (rotated square) with brass gradient
function diamond(cx, cy, hd, colorTop, colorBottom) {
  for (let y = Math.floor(cy - hd); y <= Math.ceil(cy + hd); y++) {
    for (let x = Math.floor(cx - hd); x <= Math.ceil(cx + hd); x++) {
      if (x < 0 || x >= W || y < 0 || y >= H) continue;
      if (Math.abs(x - cx) + Math.abs(y - cy) > hd) continue;
      const t = (y - (cy - hd)) / (2 * hd);
      blend((y * W + x) * 4, lerp(colorTop[0], colorBottom[0], t), lerp(colorTop[1], colorBottom[1], t), lerp(colorTop[2], colorBottom[2], t), 255);
    }
  }
}
diamond(600, 300, 138, [247, 185, 85], [237, 155, 47]);
diamond(600, 300, 92, [11, 17, 51], [6, 11, 26]);

// Thin ring around the mark
for (let a = 0; a < Math.PI * 2; a += 0.01) {
  const rOut = 165;
  const rIn = 160;
  for (let r = rIn; r <= rOut; r += 1.5) {
    const x = Math.round(600 + Math.cos(a) * r);
    const y = Math.round(300 + Math.sin(a) * r);
    if (x >= 0 && x < W && y >= 0 && y < H) blend((y * W + x) * 4, 247, 185, 85, 64);
  }
}

// Small spark dots orbiting the ring
const SPARKS = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
for (const a of SPARKS) {
  const x = Math.round(600 + Math.cos(a) * 205);
  const y = Math.round(300 + Math.sin(a) * 205);
  radialGlow(x, y, 14, 110);
}

// ---- PNG encoding ----
const CRC_TABLE = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c;
}
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crc]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 6; // color type RGBA
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;

const raw = Buffer.alloc(H * (1 + W * 4));
for (let y = 0; y < H; y++) {
  raw[y * (1 + W * 4)] = 0; // filter: none
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    const o = y * (1 + W * 4) + 1 + x * 4;
    raw[o] = px[i];
    raw[o + 1] = px[i + 1];
    raw[o + 2] = px[i + 2];
    raw[o + 3] = px[i + 3];
  }
}

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "og-image.png");
writeFileSync(outPath, png);
console.log(`OG image written: ${outPath} (${(png.length / 1024).toFixed(1)} KB)`);
