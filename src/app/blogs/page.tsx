import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blogs · STDOUT",
  description:
    "System design and engineering writing by Mihir Jataniya. In preparation.",
  openGraph: {
    title: "Blogs · STDOUT",
    description: "System design, engineering, and whatever else is worth writing down.",
    type: "website",
  },
};

/**
 * Placeholder column slots, so the page reads as a layout waiting on copy.
 * Kept broad on purpose: these are standing headings for a section, not a
 * contents list for anything already written.
 */
const slots = [
  {
    no: "01",
    kicker: "System design",
    note: "How a thing is put together, and what each choice costs.",
  },
  { no: "02", kicker: "Engineering", note: "Whatever was learned the slow way." },
  { no: "03", kicker: "Ideas", note: "Half formed, written down anyway." },
  { no: "04", kicker: "Anything else", note: "Not everything worth writing is about code." },
];

export default function BlogsPage() {
  return (
    <div className="relative z-2 px-[22px] pt-[26px] pb-[30px]">
      <div className="mx-auto max-w-[1444px]">
        <header>
          <div className="border-t-4 border-ink" />
          <div className="mt-[3px] border-t border-ink" />

          <div className="mt-[10px] flex items-baseline justify-between gap-[16px] font-mono text-[calc(11.5px*var(--ts))] tracking-[0.11em] text-ink-mute uppercase">
            <Link
              href="/"
              className="nameplate text-[calc(24px*var(--ts))] leading-none tracking-[0.02em] text-ink normal-case"
            >
              STDOUT
            </Link>
            <span className="text-right">Section C &middot; In preparation</span>
          </div>

          <h1 className="mt-[14px] text-center font-display text-[calc(clamp(38px,7vw,86px)*var(--ts))] leading-[0.98] font-semibold tracking-[-0.012em] text-ink">
            Blogs
          </h1>

          <div className="mt-[16px] grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-[12px] p600:gap-[18px]">
            <DoubleRule />
            <div className="max-w-[62ch] text-center font-display text-[calc(clamp(13px,1.5vw,17px)*var(--ts))] leading-[1.5] text-ink-2 italic">
              System design, engineering, and whatever else is worth writing down
              properly.
            </div>
            <DoubleRule />
          </div>
        </header>

        {/* The press notice: a newspaper says the page is held, it does not
            silently print white space. */}
        <section className="mt-[26px] border border-ink px-[clamp(18px,3vw,40px)] py-[clamp(34px,6vw,72px)] text-center">
          <div className="kicker">Notice from the composing room</div>

          <h2 className="mt-[13px] font-display text-[calc(clamp(30px,5vw,58px)*var(--ts))] leading-[1.04] font-semibold tracking-[-0.01em] text-ink">
            Coming soon
          </h2>

          <p className="mx-auto mt-[15px] max-w-[58ch] font-mono text-[calc(12.5px*var(--ts))] leading-[1.72] text-ink-3">
            The copy is still with the typesetter. This section will carry system design
            writing, walking through how something is put together and what each choice
            costs, along with anything else worth the trouble of explaining properly.
          </p>

          <div className="mx-auto mt-[20px] flex max-w-[420px] items-center gap-[12px]">
            <div className="dash-rule flex-1" />
            <span className="font-mono text-[calc(10.5px*var(--ts))] tracking-[0.14em] text-ink-faint uppercase">
              Held for copy
            </span>
            <div className="dash-rule flex-1" />
          </div>
        </section>

        {/* Reserved column slots. Empty frames with only a kicker and a
            standfirst, the way a page looks before the stories land. */}
        <div className="mt-[16px] grid grid-cols-1 gap-[14px] p600:grid-cols-2 p860:grid-cols-4">
          {slots.map((slot) => (
            <article
              key={slot.no}
              className="border border-dashed border-rule-45 px-[15px] pt-[13px] pb-[16px]"
            >
              <div className="flex items-baseline gap-[9px]">
                <span className="font-mono text-[calc(11.5px*var(--ts))] text-ink-faint">
                  {slot.no}
                </span>
                <span className="kicker kicker-sm">{slot.kicker}</span>
              </div>

              <div className="mt-[11px] font-display text-[calc(15px*var(--ts))] leading-[1.4] text-ink-2 italic">
                {slot.note}
              </div>

              {/* Blank rules standing in for the unset text. */}
              <div className="mt-[13px] grid gap-[8px]" aria-hidden="true">
                <div className="h-px bg-rule-30" />
                <div className="h-px bg-rule-30" />
                <div className="h-px w-[72%] bg-rule-30" />
                <div className="h-px w-[45%] bg-rule-30" />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-[18px] flex flex-wrap items-center justify-between gap-[12px] border-t border-rule-60 pt-[12px]">
          <span className="font-mono text-[calc(11.5px*var(--ts))] text-ink-mute italic">
            Until then, there is long-form writing on the project pages.
          </span>
          <div className="flex flex-wrap items-center gap-[12px]">
            <Link
              href="/projects"
              className="press-btn px-[17px] py-[9px] text-[calc(11.5px*var(--ts))] tracking-[0.11em]"
            >
              <span>Read the projects</span>
              <span>&rarr;</span>
            </Link>
            <Link
              href="/"
              className="link-underline font-mono text-[calc(11.5px*var(--ts))] tracking-[0.06em] text-ink-mute"
            >
              Back to the front page
            </Link>
          </div>
        </div>

        <footer className="mt-[16px] border-t border-ink pt-[10px] text-center font-mono text-[calc(11.5px*var(--ts))] tracking-[0.02em] text-ink-mute">
          &copy; 2026 Mihir Jataniya. All thoughts are my own.
        </footer>
      </div>
    </div>
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
