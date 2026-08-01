import { stack } from "@/data/issue";

/** Lives in the education band; the band supplies its own padding and kicker. */
export default function TechStack() {
  return (
    <section id="stack">
      <dl className="grid gap-[11px]">
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
