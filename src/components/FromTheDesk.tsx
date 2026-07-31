import { Fragment } from "react";
import ImageSlot from "@/components/ImageSlot";
import { masthead, mastheadLinks } from "@/data/issue";

/** Lead editorial: the opinion column plus the editor's portrait. */
export default function FromTheDesk({ showStamp = true }: { showStamp?: boolean }) {
  return (
    <section id="desk">
      {/* The masthead's section links are hidden on phones, so they ride the
          first kicker instead — the only nav on a phone above the fold. */}
      <div className="mb-[11px] flex items-center justify-between gap-[12px]">
        <div className="kicker">From the desk</div>

        <nav
          aria-label="Sections"
          className="flex items-center gap-[9px] font-mono text-[calc(11px*var(--ts))] font-semibold tracking-[0.11em] whitespace-nowrap text-ink-3 uppercase p600:hidden"
        >
          {mastheadLinks.map((link, i) => (
            <Fragment key={link.href}>
              {i > 0 && <span className="text-ink-faint">&bull;</span>}
              <a href={link.href} className="link-underline hover:text-accent">
                {link.label}
              </a>
            </Fragment>
          ))}
        </nav>
      </div>

      <div className="frame grid grid-cols-1 gap-[clamp(18px,2.4vw,30px)] px-[clamp(16px,2vw,26px)] pt-[clamp(16px,1.9vw,24px)] pb-[clamp(16px,1.7vw,22px)] p600:grid-cols-[minmax(0,1fr)_clamp(calc(208px*var(--ts)),31%,calc(336px*var(--ts)))]">
        <div className="min-w-0">
          <h2 className="font-display text-[calc(clamp(26px,3.05vw,40px)*var(--ts))] leading-[1.08] font-semibold tracking-[-0.008em] text-ink">
            The more i learn,<br />  The more i want to Explore
          </h2>

          <p className="mt-[18px] font-mono text-[calc(13px*var(--ts))] leading-[1.78] text-ink-3 italic">
            I've come to believe that curiosity is less about finding answers and more about staying open to change.
            <br />
          </p>

          <p className="mt-[17px] font-mono text-[calc(12.5px*var(--ts))] leading-[1.7] text-ink-3">
           It has led me toward technology, but also toward design, stories, photography, late-night ideas, and countless conversations that reshaped the way I think. I don't want to be defined by a single skill or profession
          </p>

          <p className="mt-[14px] font-mono text-[calc(12.5px*var(--ts))] leading-[1.7] text-ink-3">
            I'd rather be remembered as someone who remained genuinely interested in the world and never stopped exploring it.
          </p>

          {/* <div className="mt-[22px] grid gap-[3px] font-display text-[calc(14.5px*var(--ts))] text-ink-2 italic">
            <div>&mdash; {masthead.author}</div>
          </div> */}

          <div className="mt-[20px] flex justify-start">
            <a
              href={masthead.resumeHref}
              download={masthead.resumeFile}
              className="press-btn gap-[10px] px-[18px] py-[10px] text-[calc(12px*var(--ts))] tracking-[0.09em]"
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M14 3H7a1 1 0 00-1 1v16a1 1 0 001 1h10a1 1 0 001-1V7z" />
                <path d="M14 3v4h4" />
              </svg>
              <span>
                Resume.pdf <span className="press-btn-mute text-ink-mute">(latest)</span>
              </span>
            </a>
          </div>
        </div>

        {/* self-start matters: as a stretched grid item this box would inherit the
            full height of the text column, and the stamp — anchored to its bottom —
            would drift far below the photograph instead of overlapping its corner. */}
        <div className="relative mx-auto w-full min-w-0 max-w-[320px] self-start p600:mx-0 p600:max-w-none">
          <div className="border border-dashed border-[rgba(20,18,15,0.55)] bg-[rgba(20,18,15,0.03)] p-[6px]">
            {/* The portrait is already screened, so no .halftone overlay here —
                two dot grids stacked would moiré. */}
            <div className="relative aspect-[4/4.6] overflow-hidden">
              <ImageSlot
                src="/Mihir-img.png"
                placeholder="Portrait photo"
                alt="Portrait of Mihir Jataniya"
                priority
              />
            </div>
          </div>

          {showStamp ? <Stamp /> : null}
        </div>
      </div>
    </section>
  );
}

/** Rubber stamp pressed into the lower corner of the portrait. */
function Stamp() {
  return (
    <div
      aria-hidden="true"
      className="absolute -right-[18px] -bottom-[16px] grid size-[124px] -rotate-[13deg] place-content-center rounded-full border-2 border-accent bg-[rgba(241,237,227,0.35)] text-center text-accent opacity-[0.88] mix-blend-multiply"
    >
      <div className="absolute inset-[5px] rounded-full border border-accent opacity-85" />
      <div className="font-mono text-[calc(11px*var(--ts))] leading-[1.7] font-semibold tracking-[0.14em]">
        STDOUT
      </div>
      <div className="font-mono text-[calc(9.5px*var(--ts))] leading-[1.7] tracking-[0.1em]">AHMEDABAD</div>
      <div className="font-mono text-[calc(9.5px*var(--ts))] leading-[1.7] tracking-[0.14em]">INDIA</div>
    </div>
  );
}
