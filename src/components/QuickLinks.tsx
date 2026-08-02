import Link from "next/link";
import { quickLinks } from "@/data/issue";

export default function QuickLinks() {
  return (
    <section id="links" className="mt-[20px]">
      <div className="kicker mb-[11px]">Quick links</div>

      <div className="frame grid gap-[6px] px-[15px] py-[14px] font-mono text-[calc(12px*var(--ts))] text-ink-3">
        {quickLinks.map((link) => {
          // Profiles are off-site and open in their own tab; routes stay in the
          // app so navigation is client-side.
          const external = /^https?:/i.test(link.href);

          return (
            <div key={link.label} className="grid grid-cols-[16px_minmax(0,1fr)] gap-[6px]">
              <span className="text-ink-faint">&rarr;</span>
              {external ? (
                <a href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ) : (
                <Link href={link.href}>{link.label}</Link>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
