import SendNote from "@/components/SendNote";
import { classifieds, colophon, contact, masthead } from "@/data/issue";

/**
 * Bottom band. Four columns on wide paper, two at tablet, one on mobile —
 * rules follow whichever edge is currently interior.
 */
const cells = [
  "",
  "border-t border-rule-50 p600:border-t-0 p600:border-l p860:border-l",
  "border-t border-rule-50 p600:border-l-0 p860:border-t-0 p860:border-l",
  "border-t border-rule-50 p600:border-l p860:border-t-0",
];

export default function QuadRow() {
  return (
    <div className="mt-[14px] grid grid-cols-1 border border-rule-70 p600:grid-cols-2 p860:grid-cols-4">
      <section id="classifieds" className={`min-w-0 px-[18px] pt-[14px] pb-4 ${cells[0]}`}>
        <div className="kicker kicker-sm">Classifieds</div>
        {classifieds.map((ad, i) => (
          <div key={ad.head}>
            {i > 0 ? <div className="dash-rule my-[10px]" /> : null}
            <div
              className={`font-mono text-[11.5px] leading-[1.55] text-ink-3 ${i === 0 ? "mt-[11px]" : ""}`}
            >
              <strong className="font-semibold text-ink">{ad.head}</strong> {ad.body}
            </div>
          </div>
        ))}
      </section>

      <section id="letters" className={`min-w-0 px-[18px] pt-[14px] pb-4 ${cells[1]}`}>
        <div className="kicker kicker-sm">Letters</div>
        <div className="mt-[11px] font-mono text-[11.5px] leading-[1.55] text-ink-3">
          I read email. I reply sometimes.
        </div>
        <div className="dash-rule my-[11px]" />
        <div className="grid gap-[7px] font-mono text-[11.5px] leading-[1.5] text-ink-3">
          <div>
            Email: <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </div>
          <div>
            GitHub:{" "}
            <a href={contact.github.href} target="_blank" rel="noreferrer">
              {contact.github.label}
            </a>
          </div>
          <div>
            LinkedIn:{" "}
            <a href={contact.linkedin.href} target="_blank" rel="noreferrer">
              {contact.linkedin.label}
            </a>
          </div>
        </div>
        <p className="mt-[14px] inline-block border-b border-rule-35 pb-[2px] font-display text-[14px] leading-[1.45] text-ink-2 italic">
          Write if you have something real to say.
        </p>
      </section>

      <section id="send" className={`min-w-0 px-[18px] pt-[14px] pb-4 ${cells[2]}`}>
        <SendNote />
      </section>

      <section id="colophon" className={`min-w-0 px-[18px] pt-[14px] pb-4 ${cells[3]}`}>
        <div className="kicker kicker-sm">Colophon</div>
        <div className="mt-[11px] grid gap-[9px] font-mono text-[11.5px] leading-[1.55] text-ink-3">
          {colophon.map((line) => (
            <p key={line.slice(0, 24)}>{line}</p>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-[7px] font-mono text-[11.5px]">
          <a href={masthead.resumeHref} className="link-underline text-accent">
            Resume (PDF)
          </a>
          <span className="text-accent">&darr;</span>
        </div>
      </section>
    </div>
  );
}
