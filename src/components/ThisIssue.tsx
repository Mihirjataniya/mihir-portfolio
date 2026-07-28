import { contents } from "@/data/issue";

/** Table of contents, set as a boxed sidebar column. */
export default function ThisIssue() {
  return (
    <nav aria-label="Contents of this issue">
      <div className="kicker mb-[11px]">This issue</div>

      <div className="frame px-[15px] pt-[6px] pb-[8px]">
        {contents.map((entry, i) => (
          <div
            key={entry.no}
            className={`grid grid-cols-[26px_minmax(0,1fr)] gap-[11px] py-[9px] ${
              i === contents.length - 1 ? "pb-[6px]" : "border-b border-dashed border-rule-30"
            }`}
          >
            <span className="font-mono text-[calc(12px*var(--ts))] text-ink-mute">{entry.no}</span>
            <div className="min-w-0">
              <a
                href={entry.href}
                className="font-mono text-[calc(13px*var(--ts))] font-semibold tracking-[0.01em]"
              >
                {entry.title}
              </a>
              <div className="mt-[3px] font-mono text-[calc(11.5px*var(--ts))] text-ink-mute">{entry.blurb}</div>
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}
