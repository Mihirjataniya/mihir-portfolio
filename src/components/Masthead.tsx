import { masthead } from "@/data/issue";

/** The nameplate, hairline rules and the byline strip beneath it. */
export default function Masthead() {
  return (
    <header>
      <div className="border-t-4 border-ink" />
      <div className="mt-[3px] border-t border-ink" />

      <h1 className="nameplate mt-[16px] text-center text-[calc(clamp(64px,14.2vw,186px)*var(--ts))] leading-[0.92] tracking-[0.015em] text-ink">
        {masthead.name}
      </h1>

      <div className="mt-[14px] grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-[18px]">
        <DoubleRule />
        <div className="font-mono text-[calc(15px*var(--ts))] tracking-[0.03em] text-ink-2">{masthead.tagline}</div>
        <DoubleRule />
      </div>

      <div className="mt-[13px] grid grid-cols-1 items-center justify-items-center gap-[7px] border-y border-ink px-[2px] py-[9px] text-center font-mono text-[calc(12.5px*var(--ts))] tracking-[0.085em] text-ink-3 uppercase p600:grid-cols-[auto_minmax(0,1fr)] p600:justify-items-stretch p600:gap-[16px] p600:text-left">
        <div>
          Published by{" "}
          <span className="font-semibold text-accent">{masthead.author}</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-[11px] whitespace-nowrap">
          <span>{masthead.date}</span>
          <Dot />
          <span>{masthead.city}</span>
          <Dot />
          <span>{masthead.issue}</span>
          <Dot />
          <span>{masthead.cadence}</span>
        </div>
      </div>
    </header>
  );
}

function DoubleRule() {
  return (
    <div className="grid gap-[3px]">
      <div className="h-px bg-ink" />
      <div className="h-px bg-ink" />
    </div>
  );
}

function Dot() {
  return <span className="text-ink-faint">&bull;</span>;
}
