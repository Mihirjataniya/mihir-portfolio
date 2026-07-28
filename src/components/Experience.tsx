import { Fragment } from "react";
import { experience } from "@/data/issue";

/** Splits `**word**` into ink-black emphasis without pulling in a markdown lib. */
function emphasize(text: string) {
  return text.split("**").map((chunk, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-ink">
        {chunk}
      </strong>
    ) : (
      <Fragment key={i}>{chunk}</Fragment>
    ),
  );
}

export default function Experience() {
  return (
    <section id="experience" className="mt-[22px] border-t border-rule-60 pt-3">
      <div className="kicker">Experience</div>

      <div className="mt-3 flex flex-col items-start justify-between gap-[6px] p600:flex-row p600:items-baseline p600:gap-6">
        <h3 className="font-display text-[clamp(17px,1.7vw,22px)] font-semibold text-ink">
          {experience.role}
        </h3>
        <div className="flex-none text-left p600:text-right">
          <div className="font-mono text-[12.5px] tracking-[0.03em] text-ink">
            {experience.period}
          </div>
          <div className="mt-[2px] font-mono text-[11.5px] text-ink-mute">{experience.location}</div>
        </div>
      </div>

      <ul className="mt-[13px] grid gap-[9px] p-0">
        {experience.bullets.map((bullet) => (
          <li
            key={bullet.slice(0, 32)}
            className="grid list-none grid-cols-[13px_minmax(0,1fr)] gap-[7px] font-mono text-[12.5px] leading-[1.62] text-ink-3"
          >
            <span aria-hidden="true">&bull;</span>
            <span>{emphasize(bullet)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
