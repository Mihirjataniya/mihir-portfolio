"use client";

import { useEffect, useRef } from "react";
import { masthead, nav } from "@/data/issue";

/**
 * Running head. Hidden until the reader is 300px down the page,
 * then slides in over the paper.
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
      className="fixed inset-x-0 top-0 z-20 -translate-y-[102%] border-b border-ink bg-[rgba(246,242,233,0.93)] backdrop-blur-[3px] transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)] [box-shadow:0_1px_0_rgba(20,18,15,.35),0_6px_18px_rgba(20,18,15,.07)]"
    >
      <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-5 px-[clamp(18px,2.4vw,34px)] py-[9px]">
        <a href="#desk" className="nameplate flex-none text-[27px] leading-none tracking-[0.02em]">
          {masthead.name}
        </a>

        <nav
          aria-label="Sections"
          className="hidden items-center gap-5 font-mono text-[11.5px] tracking-[0.11em] text-ink-3 uppercase p760:flex"
        >
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href={masthead.resumeHref}
          className="press-btn flex-none px-[13px] py-[6px] text-[10.5px] tracking-[0.12em]"
        >
          <span>Resume</span>
          <span>&darr;</span>
        </a>
      </div>
    </div>
  );
}
