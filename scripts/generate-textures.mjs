/**
 * Generates the paper stock tiles used by the grain layers in globals.css.
 *
 *   paper-fibre.png   440x440   fine vertical pulp fibre
 *   paper-mottle.png  1024x1024 broad damp blotching
 *
 * paper-flecks.png ships as-is from the original design and is not regenerated.
 *
 * Both tiles are seamlessly tileable RGBA: warm-black ink on full transparency,
 * matching how the design's own flecks tile works. They are composited with
 * mix-blend-mode: multiply, so INK_ALPHA below maps straight to how much the
 * paper darkens — that is the dial for "more/less texture".
 *
 *   node scripts/generate-textures.mjs
 */
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";

const OUT = new URL("../public/textures/", import.meta.url);

/* --- deterministic PRNG so re-running produces the same paper ---------- */
function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const smooth = (t) => t * t * (3 - 2 * t);

/** Value noise on a wrapping lattice — gx by gy cells across the whole tile. */
function lattice(gx, gy, rand) {
  const g = new Float32Array(gx * gy);
  for (let i = 0; i < g.length; i++) g[i] = rand();
  return (u, v) => {
    const x = u * gx;
    const y = v * gy;
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const fx = smooth(x - x0);
    const fy = smooth(y - y0);
    const xa = ((x0 % gx) + gx) % gx;
    const ya = ((y0 % gy) + gy) % gy;
    const xb = (xa + 1) % gx;
    const yb = (ya + 1) % gy;
    const v00 = g[ya * gx + xa];
    const v10 = g[ya * gx + xb];
    const v01 = g[yb * gx + xa];
    const v11 = g[yb * gx + xb];
    return (
      v00 * (1 - fx) * (1 - fy) + v10 * fx * (1 - fy) + v01 * (1 - fx) * fy + v11 * fx * fy
    );
  };
}

/** Sums octaves, each layer finer and quieter than the last. */
function fbm(octaves, rand) {
  const layers = octaves.map(([gx, gy, amp]) => ({ n: lattice(gx, gy, rand), amp }));
  const total = layers.reduce((s, l) => s + l.amp, 0);
  return (u, v) => layers.reduce((s, l) => s + l.amp * l.n(u, v), 0) / total;
}

/* --- minimal 8-bit greyscale PNG encoder ------------------------------- */
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "latin1"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodeRGBA(width, height, pixels) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type: truecolour + alpha

  const stride = width * 4;
  // one filter byte per scanline; 2 = up, which compresses noise far better than none
  const raw = Buffer.alloc(height * (stride + 1));
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 2;
    for (let x = 0; x < stride; x++) {
      const cur = pixels[y * stride + x];
      const up = y > 0 ? pixels[(y - 1) * stride + x] : 0;
      raw[y * (stride + 1) + 1 + x] = (cur - up) & 0xff;
    }
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* --- the two tiles ----------------------------------------------------- */
const INK = [26, 22, 17]; // warm black, a shade off the body ink

/**
 * `curve` maps raw 0..1 noise to ink coverage 0..1. Everything below the knee
 * stays paper-white, so the ink lands as discrete strands/blotches rather than
 * an even wash.
 */
function render(size, seed, octaves, peakAlpha, curve) {
  const noise = fbm(octaves, mulberry32(seed));
  const px = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const a = Math.max(0, Math.min(1, curve(noise(x / size, y / size))));
      const i = (y * size + x) * 4;
      px[i] = INK[0];
      px[i + 1] = INK[1];
      px[i + 2] = INK[2];
      px[i + 3] = Math.round(a * peakAlpha);
    }
  }
  return encodeRGBA(size, size, px);
}

mkdirSync(OUT, { recursive: true });

// Fibre: lattices are dense across x and sparse down y, so strands stretch
// vertically the way pulp fibres do.
const fibre = render(
  440,
  0x5104f,
  [
    [220, 66, 1],
    [440, 132, 0.55],
    [110, 33, 0.35],
    [44, 16, 0.22],
  ],
  150,
  (n) => (n - 0.42) / 0.5,
);

// Mottle: broad damp-looking patches, nothing high frequency.
const mottle = render(
  1024,
  0x9c0ffee,
  [
    [4, 4, 1],
    [8, 8, 0.5],
    [16, 16, 0.25],
    [32, 32, 0.12],
  ],
  105,
  (n) => (n - 0.45) / 0.45,
);

writeFileSync(new URL("paper-fibre.png", OUT), fibre);
writeFileSync(new URL("paper-mottle.png", OUT), mottle);

console.log(`paper-fibre.png  440x440   ${(fibre.length / 1024).toFixed(1)} KB`);
console.log(`paper-mottle.png 1024x1024 ${(mottle.length / 1024).toFixed(1)} KB`);
