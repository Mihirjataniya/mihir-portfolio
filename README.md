# STDOUT — a personal engineering newspaper

Portfolio of Mihir Jataniya, set as a broadsheet newspaper. Next.js 16 (App Router,
Turbopack), React 19, TypeScript, Tailwind CSS v4 with a layer of hand-written CSS
for the press effects.

```bash
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

## Layout of the code

```
src/app/layout.tsx      fonts (Playfair Display, IBM Plex Mono, UnifrakturMaguntia) + metadata
src/app/globals.css     design tokens, paper grain, typographic furniture (.kicker, .frame, …)
src/app/page.tsx        page composition — masthead, body columns, bottom bands
src/components/         one component per section of the paper
src/data/issue.ts       all copy: bio, experience, projects, stack, notes, contact
```

Edit `src/data/issue.ts` to publish a new issue — components read from it and stay put.

## Press settings

`:root` in `globals.css` carries the knobs from the original design:

| Variable     | Default     | Effect                                                   |
| ------------ | ----------- | -------------------------------------------------------- |
| `--accent`   | `#8e2b1c`   | rules, kickers, stamp, hover states                       |
| `--grain-on` | `1`         | set to `0` to print on clean stock (kills all texture)    |
| `--np`       | blackletter | nameplate face; swap to `var(--font-playfair)` for serif  |

Accent alternates that shipped with the design: `#1f4e6b`, `#2e5b3c`, `#6b4a16`.

## Paper stock

Four fixed layers on `html`/`body`, all `mix-blend-mode: multiply`: fibre (440px
tile, opacity `.26`), flecks (560px, `.5`), mottle (900px, `.3`) and a radial
vignette. Every tile is warm-black ink on transparency, so layer opacity maps
directly to how much the paper darkens — that is the dial for more/less texture.

The base `#f6f2e9` on `html` sits a shade above the design's `#f1ede3` because the
ink layers multiply it back down to roughly `#eae6dd`.

`public/textures/paper-flecks.png` is the original tile from the design. Fibre and
mottle exceeded the design API's 256 KiB per-file read limit and are generated
instead — seamless value-noise fBm, deterministic seeds:

```bash
node scripts/generate-textures.mjs   # rewrites paper-fibre.png + paper-mottle.png
```

For coarser or finer paper, change the octave lattices and `peakAlpha` in that
script; for simply more or less of it, change the layer opacities in `globals.css`.

## Things to drop in

- `public/resume.pdf` — linked from the running head, the desk column and the colophon.
- Photographs: pass `src` to `<ImageSlot>` (portrait in `FromTheDesk`, engraving in
  `EducationBar`) or set `imageSrc` on a project in `src/data/issue.ts`. Until then each
  slot renders a labelled placeholder. Images are auto-treated: grayscale, contrast
  bump, halftone dot screen.
- Real `live` / `source` URLs for the projects (currently anchored to `#print`).

The contact form composes a `mailto:` — no backend, no trackers.
