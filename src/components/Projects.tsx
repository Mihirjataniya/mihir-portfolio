import ImageSlot from "@/components/ImageSlot";
import { projects, type Project } from "@/data/issue";

export default function Projects() {
  return (
    <section id="print" className="mt-[22px] border-t border-rule-60 pt-[12px]">
      <div className="kicker">Currently in print</div>

      <div className="mt-[11px] grid grid-cols-[repeat(auto-fit,minmax(calc(248px*var(--ts)),1fr))] border border-rule-55">
        {projects.map((project, i) => (
          <ProjectCard key={project.no} project={project} first={i === 0} />
        ))}
      </div>

      <div className="mt-[12px] flex flex-wrap items-center justify-between gap-[12px]">
        <span className="font-mono text-[calc(11.5px*var(--ts))] text-ink-mute italic">
          More in the archive &mdash; back issues, experiments, dead ends.
        </span>
        <a
          href="#print"
          className="press-btn px-[17px] py-[9px] text-[calc(11.5px*var(--ts))] tracking-[0.11em]"
        >
          <span>See all projects</span>
          <span>&rarr;</span>
        </a>
      </div>
    </section>
  );
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="link-underline">
      {children}
    </a>
  );
}

function ProjectCard({ project, first }: { project: Project; first: boolean }) {
  return (
    <article
      className={`min-w-0 px-[15px] pt-[14px] pb-[15px] ${first ? "" : "border-rule-55 p600:border-l"}`}
    >
      <div className="flex items-baseline gap-[9px]">
        <span className="font-mono text-[calc(11.5px*var(--ts))] text-ink-mute">{project.no}</span>
        <h4 className="font-display text-[calc(17px*var(--ts))] font-semibold text-ink">{project.title}</h4>
      </div>

      <div className="mt-[11px] grid grid-cols-1 gap-[12px] p600:grid-cols-[minmax(96px,0.85fr)_minmax(0,1.6fr)]">
        <div className="relative aspect-[16/10] overflow-hidden border border-rule-35 p600:aspect-[3/3.5]">
          <ImageSlot
            src={project.imageSrc}
            alt={project.imageAlt}
            placeholder={project.imageAlt}
          />
          <div className="halftone opacity-[0.26] [background-image:radial-gradient(circle_at_1px_1px,rgba(20,18,15,.85)_0.7px,transparent_1.1px)]" />
        </div>

        <div className="grid min-w-0 gap-[9px] font-mono text-[calc(11px*var(--ts))] leading-[1.55] text-ink-3">
          <p>{project.summary}</p>
          <p>
            <strong className="font-semibold text-ink">Technical Decision:</strong> {project.decision}
          </p>
          <p>
            <strong className="font-semibold text-ink">Implementation:</strong>{" "}
            {project.implementation}
          </p>
        </div>
      </div>

      <div className="mt-[12px] flex flex-wrap items-center gap-[9px] font-mono text-[calc(11.5px*var(--ts))]">
        <ExternalLink href={project.live}>live</ExternalLink>
        <span className="text-ink-faint">&#8599;</span>
        <ExternalLink href={project.source}>source</ExternalLink>
        {project.npm ? (
          <>
            <span className="text-ink-faint">&#8599;</span>
            <ExternalLink href={project.npm}>npm</ExternalLink>
          </>
        ) : null}
      </div>

      <div className="mt-[9px] flex flex-wrap gap-[4px]">
        {project.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
