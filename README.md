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

Four fixed layers over `#f1ede3`, from `public/textures/`:

| Layer           | Tile              | Blend      | Opacity | z |
| --------------- | ----------------- | ---------- | ------- | - |
| `html::before`  | fibre, 440px      | soft-light | `.52`   | 3 |
| `html::after`   | flecks, 560px     | multiply   | `.30`   | 4 |
| `body::before`  | mottle, 900px     | soft-light | `.30`   | 3 |
| `body::after`   | radial vignette   | multiply   | `.50`   | 3 |

Fibre and mottle are mid-grey emboss maps and must stay on `soft-light` —
multiplying them throws away their highlights and flattens the weave into dirt.
Only flecks and the vignette multiply. `--grain-on: 0` removes all four.

## A note on the CSS layers

Base resets and the `.kicker` / `.frame` / `.press-btn` / `.field` component
classes live inside `@layer base` and `@layer components`. This matters: unlayered
CSS outranks every Tailwind layer, so `p { margin: 0 }` sitting outside a layer
silently beats `mt-[18px]` on the same element. Keep new global CSS in a layer.

## Things to drop in

- `public/resume.pdf` — linked from the running head, the desk column and the colophon.
- Photographs: pass `src` to `<ImageSlot>` (portrait in `FromTheDesk`, engraving in
  `EducationBar`) or set `imageSrc` on a project in `src/data/issue.ts`. Until then each
  slot renders a labelled placeholder. Images are auto-treated: grayscale, contrast
  bump, halftone dot screen.
- Real `live` / `source` URLs for the projects (currently anchored to `#print`).

The contact form composes a `mailto:` — no backend, no trackers.
