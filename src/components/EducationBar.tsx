import ImageSlot from "@/components/ImageSlot";
import { education, quickLinks } from "@/data/issue";

/** Full-width band: education on the left, quick links + engraving on the right. */
export default function EducationBar() {
  return (
    <div className="mt-[24px] grid grid-cols-1 border border-rule-70 p860:grid-cols-[clamp(calc(228px*var(--ts)),25%,calc(320px*var(--ts)))_minmax(0,1fr)]">
      <section id="education" className="min-w-0 px-[20px] pt-[15px] pb-[17px]">
        <div className="kicker">Education</div>
        <div className="mt-[12px] font-mono text-[calc(12.5px*var(--ts))] leading-[1.55] text-ink">
          {education.school}
        </div>
        <div className="mt-[3px] font-mono text-[calc(11.8px*var(--ts))] text-ink-mute">{education.place}</div>
        <div className="dash-rule my-[12px]" />
        <div className="font-mono text-[calc(12.5px*var(--ts))] text-ink">{education.degree}</div>
        <div className="mt-[3px] font-mono text-[calc(11.8px*var(--ts))] text-ink-mute">{education.years}</div>
      </section>

      <div className="min-w-0 border-t border-rule-50 px-[20px] pt-[15px] pb-[17px] p860:border-t-0 p860:border-l">
        <div className="kicker">Quick links</div>

        <div className="mt-[12px] grid grid-cols-1 items-start gap-[clamp(14px,2vw,24px)] p860:grid-cols-[minmax(0,1fr)_clamp(calc(150px*var(--ts)),30%,calc(250px*var(--ts)))]">
          <div className="grid gap-[6px] font-mono text-[calc(12px*var(--ts))] text-ink-3">
            {quickLinks.map((link) => (
              <div key={link.label} className="grid grid-cols-[16px_minmax(0,1fr)] gap-[6px]">
                <span className="text-ink-faint">&rarr;</span>
                <a href={link.href}>{link.label}</a>
              </div>
            ))}
          </div>

          <div className="relative aspect-[5/2.6] max-w-[280px] opacity-90 mix-blend-multiply p860:max-w-none">
            <ImageSlot placeholder="Newspaper engraving" alt="Newspaper engraving" fit="contain" />
          </div>
        </div>
      </div>
    </div>
  );
}
