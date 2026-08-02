import Link from "next/link";

/** Reached when a slug does not exist — `dynamicParams` is off, so that is a 404. */
export default function ProjectNotFound() {
  return (
    <div className="relative z-2 px-[22px] pt-[26px] pb-[30px]">
      <div className="mx-auto max-w-[1444px]">
        <div className="border-t-4 border-ink" />
        <div className="mt-[3px] border-t border-ink" />

        <div className="mx-auto max-w-[62ch] py-[clamp(48px,9vw,110px)] text-center">
          <div className="kicker">Page not found</div>

          <h1 className="mt-[12px] font-display text-[calc(clamp(34px,5.5vw,64px)*var(--ts))] leading-[1.02] font-semibold tracking-[-0.012em] text-ink">
            No such edition
          </h1>

          <p className="mt-[14px] font-display text-[calc(clamp(14px,1.6vw,18px)*var(--ts))] leading-[1.5] text-ink-2 italic">
            That project has never gone to print, or the slug changed after it did.
          </p>

          <div className="mt-[22px] flex flex-wrap items-center justify-center gap-[12px]">
            <Link
              href="/projects"
              className="press-btn px-[17px] py-[9px] text-[calc(11.5px*var(--ts))] tracking-[0.11em]"
            >
              <span>See every project</span>
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

        <footer className="border-t border-ink pt-[10px] text-center font-mono text-[calc(11.5px*var(--ts))] tracking-[0.02em] text-ink-mute">
          &copy; 2026 Mihir Jataniya. All thoughts are my own.
        </footer>
      </div>
    </div>
  );
}
