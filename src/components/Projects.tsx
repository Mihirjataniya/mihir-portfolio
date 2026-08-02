import { Fragment } from "react";
import Link from "next/link";
import ImageSlot from "@/components/ImageSlot";
import { projectLinks, projects, type Project } from "@/data/projects";

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
        <Link
          href="/projects"
          className="press-btn px-[17px] py-[9px] text-[calc(11.5px*var(--ts))] tracking-[0.11em]"
        >
          <span>See all projects</span>
          <span>&rarr;</span>
        </Link>
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

      {/* The plate runs the full width of the card with the copy underneath —
          a cropped-to-portrait thumbnail threw away most of the frame. The
          aspect matches the screenshots' own 1917x865 so `cover` has nothing
          left to trim; reshoot at that ratio or this starts cropping again. */}
      <div className="mt-[11px] grid grid-cols-1 gap-[12px]">
        <div className="relative aspect-[1917/865] overflow-hidden border border-rule-35">
          <ImageSlot
            src={project.imageSrc}
            alt={project.imageAlt}
            placeholder={project.imageAlt}
            sizes="(max-width: 600px) 92vw, (max-width: 1080px) 46vw, 500px"
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

      {/* Which links exist varies by project — only a published package has an
          npm entry — so the row is driven off the data rather than hardcoded. */}
      <div className="mt-[12px] flex flex-wrap items-center gap-[9px] font-mono text-[calc(11.5px*var(--ts))]">
        {projectLinks(project).map((link, i) => (
          <Fragment key={link.label}>
            {i > 0 ? <span className="text-ink-faint">&#8599;</span> : null}
            <ExternalLink href={link.href}>{link.label}</ExternalLink>
          </Fragment>
        ))}
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
