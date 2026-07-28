import { stack } from "@/data/issue";

export default function TechStack() {
  return (
    <section id="stack" className="mt-[20px]">
      <div className="kicker mb-[11px]">Tech stack</div>

      <dl className="frame grid gap-[11px] px-[15px] py-[14px]">
        {stack.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[minmax(62px,0.52fr)_minmax(0,1fr)] items-start gap-[10px]"
          >
            <dt className="pt-px font-mono text-[calc(11px*var(--ts))] text-ink-mute">{row.label}</dt>
            <dd className="m-0 font-mono text-[calc(11.8px*var(--ts))] leading-[1.5] text-ink-3">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
