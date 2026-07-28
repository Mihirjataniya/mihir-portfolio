"use client";

import { useEffect, useRef } from "react";
import { masthead, nav } from "@/data/issue";

/**
 * Running head. Hidden until the reader is 300px down the page, then slides in
 * over the paper.
 *
 * The hidden state lives in .running-head (a real `transform`) rather than a
 * Tailwind translate utility: v4 compiles those to the `translate` property, so
 * setting `style.transform` here would never cancel them and the bar stayed off
 * screen forever.
 */
export default function SiteHeader() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      el.style.transform = window.scrollY > 300 ? "translateY(0)" : "translateY(-102%)";
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className="running-head fixed inset-x-0 top-0 z-20 border-b border-ink bg-[rgba(241,237,227,0.93)] backdrop-blur-[3px] [box-shadow:0_1px_0_rgba(20,18,15,.35),0_6px_18px_rgba(20,18,15,.07)]"
    >
      <div className="mx-auto flex max-w-[1444px] items-center justify-between gap-[20px] px-[22px] py-[9px]">
        <a href="#desk" className="nameplate flex-none text-[calc(27px*var(--ts))] leading-none tracking-[0.02em]">
          {masthead.name}
        </a>

        <nav
          aria-label="Sections"
          className="hidden items-center gap-[20px] font-mono text-[calc(11.5px*var(--ts))] tracking-[0.11em] text-ink-3 uppercase p760:flex"
        >
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href={masthead.resumeHref}
          className="press-btn flex-none gap-[7px] px-[13px] py-[6px] text-[calc(10.5px*var(--ts))] tracking-[0.12em]"
        >
          <span>Resume</span>
          <span>&darr;</span>
        </a>
      </div>
    </div>
  );
}
