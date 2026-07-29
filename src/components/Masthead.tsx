import { Fragment } from "react";
import { masthead, mastheadLinks } from "@/data/issue";

/** The nameplate, hairline rules and the byline strip beneath it. */
export default function Masthead() {
  return (
    <header>
      <div className="border-t-4 border-ink" />
      <div className="mt-[3px] border-t border-ink" />

      <h1 className="nameplate mt-[16px] text-center text-[calc(clamp(78px,15.5vw,186px)*var(--ts))] leading-[0.92] tracking-[0.015em] text-ink">
        {masthead.name}
      </h1>

      {/* Tagline sits between two double rules. On phones it has to stay on one
          line or the rules get squeezed to nothing, hence the smaller type,
          tighter tracking and nowrap below p600. */}
      <div className="mt-[14px] grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-[12px] p600:gap-[18px]">
        <DoubleRule />
        <div className="font-mono text-[calc(10.5px*var(--ts))] tracking-[0.02em] whitespace-nowrap text-ink-2 p600:text-[calc(15px*var(--ts))] p600:tracking-[0.03em]">
          {masthead.tagline}
        </div>
        <DoubleRule />
      </div>

      <div className="mt-[13px] grid grid-cols-1 items-center justify-items-center gap-[7px] border-y border-ink px-[2px] py-[9px] text-center font-mono text-[calc(12.5px*var(--ts))] tracking-[0.085em] text-ink-3 uppercase p600:grid-cols-[auto_minmax(0,1fr)] p600:justify-items-stretch p600:gap-[16px] p600:text-left">
        <div>
          Published by{" "}
          <span className="font-semibold text-accent">{masthead.author}</span>
        </div>
        <nav
          aria-label="Masthead links"
          className="hidden flex-wrap items-center justify-center gap-[11px] whitespace-nowrap p600:flex p600:justify-end"
        >
          {mastheadLinks.map((link, i) => (
            <Fragment key={link.href}>
              {i > 0 && <Dot />}
              <a href={link.href} className="link-underline font-semibold hover:text-accent">
                {link.label}
              </a>
            </Fragment>
          ))}
        </nav>
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
