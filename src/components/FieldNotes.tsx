import type { JSX } from "react";
import { fieldNotes } from "@/data/issue";

const strokeProps = {
  viewBox: "0 0 24 24",
  width: 16,
  height: 16,
  fill: "none",
  stroke: "#14120F",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "mt-[2px]",
  "aria-hidden": true,
};

const icons: Record<string, JSX.Element> = {
  book: (
    <svg {...strokeProps}>
      <path d="M12 6.6C10.4 5.1 8 4.6 3.8 5.1v13c4.2-.5 6.6 0 8.2 1.5 1.6-1.5 4-2 8.2-1.5v-13C16 4.6 13.6 5.1 12 6.6z" />
      <path d="M12 6.6v13" />
    </svg>
  ),
  screen: (
    <svg {...strokeProps}>
      <rect x="2.5" y="4" width="19" height="12.5" rx="1.5" />
      <path d="M9 20h6M12 16.5V20" />
    </svg>
  ),
  code: (
    <svg {...strokeProps}>
      <path d="M9 8l-4.5 4L9 16M15 8l4.5 4L15 16" />
    </svg>
  ),
  headphones: (
    <svg {...strokeProps}>
      <path d="M4.5 14v-2a7.5 7.5 0 0115 0v2" />
      <rect x="2.5" y="13.5" width="4.5" height="7" rx="2" />
      <rect x="17" y="13.5" width="4.5" height="7" rx="2" />
    </svg>
  ),
  pen: (
    <svg {...strokeProps}>
      <path d="M4 20.5h4L20.5 8l-4-4L4 16.5v4z" />
      <path d="M14.5 6l3.5 3.5" />
    </svg>
  ),
  mug: (
    <svg {...strokeProps}>
      <path d="M3.5 7.5h13v6.5a5 5 0 01-5 5h-3a5 5 0 01-5-5V7.5z" />
      <path d="M16.5 9h2a2.5 2.5 0 010 5h-2" />
      <path d="M4 22h13" />
    </svg>
  ),
};

export default function FieldNotes() {
  return (
    <section id="notes" className="mt-5">
      <div className="kicker mb-[11px]">Field notes</div>

      <div className="frame grid gap-[11px] px-[15px] py-[14px]">
        {fieldNotes.map((note) => (
          <div
            key={note.label}
            className="grid grid-cols-[19px_minmax(0,1fr)] items-start gap-[10px]"
          >
            {icons[note.icon]}
            <div className="font-mono text-[11.8px] leading-[1.5] text-ink-3">
              <strong className="font-semibold text-ink">{note.label}</strong> {note.text}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
