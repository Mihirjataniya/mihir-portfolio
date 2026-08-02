"use client";

import { useMemo, useRef, useState } from "react";
import { sudoku } from "@/data/issue";

const GIVENS = sudoku.givens.split("").map((c) => (c === "." ? 0 : Number(c)));
const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

/** Indices sharing a row, column or 3x3 box with `i` — `i` itself excluded. */
function peers(i: number): number[] {
  const row = Math.floor(i / 9);
  const col = i % 9;
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  const out = new Set<number>();

  for (let k = 0; k < 9; k++) {
    out.add(row * 9 + k);
    out.add(k * 9 + col);
    out.add((boxRow + Math.floor(k / 3)) * 9 + boxCol + (k % 3));
  }
  out.delete(i);
  return [...out];
}

const PEERS = Array.from({ length: 81 }, (_, i) => peers(i));

/**
 * Playable 9x9 sudoku. Entries live in component state only — nothing is
 * persisted, so a reload deals the same grid fresh.
 *
 * Input is keyboard (digits, backspace, arrows) plus a tap pad underneath for
 * touch, since the sidebar is far too narrow for comfortable cell-sized hit
 * targets on a phone.
 */
export default function Sudoku() {
  const [values, setValues] = useState<number[]>(GIVENS);
  const [selected, setSelected] = useState<number | null>(null);
  const cells = useRef<(HTMLButtonElement | null)[]>([]);

  /** Filled cells that clash with a peer holding the same digit. */
  const conflicts = useMemo(() => {
    const bad = new Set<number>();
    values.forEach((v, i) => {
      if (v !== 0 && PEERS[i].some((p) => values[p] === v)) bad.add(i);
    });
    return bad;
  }, [values]);

  const solved = values.every((v, i) => v === Number(sudoku.solution[i]));

  const write = (i: number | null, digit: number) => {
    if (i === null || GIVENS[i] !== 0) return;
    setValues((prev) => {
      const next = [...prev];
      // Tapping the digit a cell already holds erases it, so the pad alone is
      // enough to correct a mistake on touch.
      next[i] = next[i] === digit ? 0 : digit;
      return next;
    });
  };

  const move = (i: number, dRow: number, dCol: number) => {
    const row = Math.min(8, Math.max(0, Math.floor(i / 9) + dRow));
    const col = Math.min(8, Math.max(0, (i % 9) + dCol));
    const next = row * 9 + col;
    setSelected(next);
    // The roving tabindex below only decides which cell is *tabbable*. DOM
    // focus has to be dragged along by hand, otherwise the cell we just left
    // keeps receiving keystrokes and the next digit lands in the wrong square.
    cells.current[next]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const arrows: Record<string, [number, number]> = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    };

    if (arrows[e.key]) {
      e.preventDefault();
      move(i, ...arrows[e.key]);
      return;
    }
    if (/^[1-9]$/.test(e.key)) {
      e.preventDefault();
      write(i, Number(e.key));
      return;
    }
    if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") {
      e.preventDefault();
      if (GIVENS[i] === 0) setValues((prev) => prev.map((v, k) => (k === i ? 0 : v)));
    }
  };

  const active = selected === null ? 0 : values[selected];

  return (
    <section id="puzzle" className="mt-[20px]">
      <div className="mb-[11px] flex items-baseline justify-between gap-[10px]">
        <div className="kicker">Sudoku</div>
        <div className="font-mono text-[calc(10.5px*var(--ts))] tracking-[0.08em] text-ink-faint">
          {sudoku.no} &middot; {sudoku.difficulty}
        </div>
      </div>

      <div className="frame px-[13px] pt-[13px] pb-[12px]">
        <div
          role="grid"
          aria-label="Sudoku puzzle"
          className="grid grid-cols-9 border-t border-l border-rule-70 select-none"
        >
          {values.map((v, i) => {
            const given = GIVENS[i] !== 0;
            const isSelected = selected === i;
            // The whole row, column and box of the selected cell gets a wash —
            // it's how you scan a sudoku, and it costs nothing to render.
            const inScope = selected !== null && (isSelected || PEERS[selected].includes(i));
            const sameDigit = active !== 0 && v === active;
            const bad = conflicts.has(i);

            return (
              <button
                key={i}
                ref={(el) => {
                  cells.current[i] = el;
                }}
                type="button"
                role="gridcell"
                aria-label={`Row ${Math.floor(i / 9) + 1}, column ${(i % 9) + 1}${
                  v === 0 ? ", empty" : `, ${v}${given ? ", given" : ""}`
                }`}
                aria-invalid={bad || undefined}
                tabIndex={isSelected || (selected === null && i === 0) ? 0 : -1}
                onClick={() => setSelected(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={[
                  "relative aspect-square border-r border-b border-rule-30 font-mono outline-none",
                  "text-[calc(12px*var(--ts))] leading-none transition-colors duration-100",
                  // 3x3 box seams: heavier rules on every third edge.
                  i % 3 === 2 ? "border-r-rule-70" : "",
                  Math.floor(i / 9) % 3 === 2 ? "border-b-rule-70" : "",
                  given ? "font-semibold text-ink" : "text-accent",
                  bad ? "bg-[rgba(142,43,28,0.14)]" : "",
                  isSelected ? "bg-[rgba(20,18,15,0.16)]" : "",
                  !isSelected && sameDigit && !bad ? "bg-[rgba(142,43,28,0.09)]" : "",
                  !isSelected && !sameDigit && inScope && !bad ? "bg-[rgba(20,18,15,0.05)]" : "",
                ].join(" ")}
              >
                {v !== 0 ? v : ""}
              </button>
            );
          })}
        </div>

        <div className="mt-[11px] grid grid-cols-9 gap-[3px]">
          {DIGITS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => write(selected, d)}
              disabled={selected === null || GIVENS[selected] !== 0}
              aria-label={`Enter ${d}`}
              className="frame-soft aspect-square font-mono text-[calc(11px*var(--ts))] leading-none text-ink-3 transition-colors duration-100 hover:bg-[rgba(20,18,15,0.07)] disabled:opacity-35"
            >
              {d}
            </button>
          ))}
        </div>

        <div className="dash-rule mt-[12px] pt-[9px] font-mono text-[calc(10px*var(--ts))] tracking-[0.06em] text-ink-faint">
          {solved ? (
            <span className="font-semibold tracking-[0.14em] text-accent uppercase">
              &#10003; Solved &mdash; well played
            </span>
          ) : (
            <div className="flex items-baseline justify-between gap-[10px]">
              <span>Tap a square, then a number.</span>
              <button
                type="button"
                onClick={() => {
                  setValues(GIVENS);
                  setSelected(null);
                }}
                className="link-underline tracking-[0.1em] text-ink-mute uppercase"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
