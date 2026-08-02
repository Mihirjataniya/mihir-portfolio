import type { Metadata } from "next";
import Link from "next/link";
import ImageSlot from "@/components/ImageSlot";
import SiteHeader from "@/components/SiteHeader";
import { projectLinks, projects, type Project } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects in Print — STDOUT",
  description:
    "The full run of projects by Mihir Jataniya — real-time systems, developer tooling and the reasoning behind each build.",
  openGraph: {
    title: "Projects in Print — STDOUT",
    description: "The full run of projects, with the reasoning behind each build.",
    type: "website",
  },
};

export default function ProjectsPage() {
  return (
    <>
      <SiteHeader />

      <div className="relative z-2 px-[22px] pt-[26px] pb-[30px]">
        <div className="mx-auto max-w-[1444px]">
          <SectionMasthead />

          <div className="mt-[24px] border-t border-ink">
            {projects.map((project) => (
              <ProjectEntry key={project.slug} project={project} />
            ))}
          </div>

          <div className="mt-[18px] flex flex-wrap items-center justify-between gap-[12px] border-t border-rule-60 pt-[12px]">
            <span className="font-mono text-[calc(11.5px*var(--ts))] text-ink-mute italic">
              Back issues, experiments and dead ends are still being typeset.
            </span>
            <Link
              href="/"
              className="press-btn px-[17px] py-[9px] text-[calc(11.5px*var(--ts))] tracking-[0.11em]"
            >
              <span>&larr;</span>
              <span>Back to the front page</span>
            </Link>
          </div>

          <footer className="mt-[16px] border-t border-ink pt-[10px] text-center font-mono text-[calc(11.5px*var(--ts))] tracking-[0.02em] text-ink-mute">
            &copy; 2026 Mihir Jataniya. All thoughts are my own.
          </footer>
        </div>
      </div>
    </>
  );
}

/**
 * The section front. Deliberately not the full nameplate — a section page in a
 * paper carries a smaller wordmark and gives the headline the room instead.
 */
function SectionMasthead() {
  return (
    <header>
      <div className="border-t-4 border-ink" />
      <div className="mt-[3px] border-t border-ink" />

      <div className="mt-[10px] flex items-baseline justify-between gap-[16px] font-mono text-[calc(11.5px*var(--ts))] tracking-[0.11em] text-ink-mute uppercase">
        <Link href="/" className="nameplate text-[calc(24px*var(--ts))] leading-none tracking-[0.02em] normal-case text-ink">
          STDOUT
        </Link>
        <span className="text-right">
          Section B &middot; {projects.length} {projects.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      <h1 className="mt-[14px] text-center font-display text-[calc(clamp(38px,7vw,86px)*var(--ts))] leading-[0.98] font-semibold tracking-[-0.012em] text-ink">
        Projects in Print
      </h1>

      <div className="mt-[16px] grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-[12px] p600:gap-[18px]">
        <DoubleRule />
        <div className="max-w-[62ch] text-center font-display text-[calc(clamp(13px,1.5vw,17px)*var(--ts))] leading-[1.5] text-ink-2 italic">
          What got built, why it got built that way, and what fought back.
        </div>
        <DoubleRule />
      </div>
    </header>
  );
}

function DoubleRule() {
  return (
    <div className="grid gap-[3px]">
      <div className="h-px bg-ink" />
      <div className="h-px bg-ink" />
    </div>
  );
}

function ProjectEntry({ project }: { project: Project }) {
  const href = `/projects/${project.slug}`;

  return (
    <article className="grid grid-cols-1 gap-[clamp(16px,2.2vw,30px)] border-b border-rule-55 py-[clamp(18px,2.2vw,28px)] p860:grid-cols-[minmax(0,1.05fr)_minmax(0,1.3fr)]">
      <Link href={href} className="group block min-w-0" aria-label={`Read the full story on ${project.title}`}>
        <div className="relative aspect-[1917/865] overflow-hidden border border-rule-35">
          <ImageSlot
            src={project.imageSrc}
            alt={project.imageAlt}
            placeholder={project.imageAlt}
            sizes="(max-width: 860px) 92vw, 46vw"
          />
          <div className="halftone opacity-[0.26] [background-image:radial-gradient(circle_at_1px_1px,rgba(20,18,15,.85)_0.7px,transparent_1.1px)]" />
        </div>
      </Link>

      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-[10px] gap-y-[4px] font-mono text-[calc(11px*var(--ts))] tracking-[0.09em] text-ink-mute uppercase">
          <span>{project.no}</span>
          <span className="text-ink-faint">&bull;</span>
          <span className="text-accent">{project.status}</span>
          <span className="text-ink-faint">&bull;</span>
          <span>{project.period}</span>
        </div>

        <h2 className="mt-[7px] font-display text-[calc(clamp(24px,3vw,38px)*var(--ts))] leading-[1.08] font-semibold tracking-[-0.008em] text-ink">
          <Link href={href} className="hover:text-accent">
            {project.title}
          </Link>
        </h2>

        <p className="mt-[9px] font-display text-[calc(clamp(14px,1.5vw,17px)*var(--ts))] leading-[1.5] text-ink-2 italic">
          {project.dek}
        </p>

        <p className="mt-[12px] font-mono text-[calc(12px*var(--ts))] leading-[1.65] text-ink-3">
          {project.summary}
        </p>

        <div className="mt-[12px] flex flex-wrap gap-[4px]">
          {project.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-[14px] flex flex-wrap items-center gap-[14px]">
          <Link
            href={href}
            className="press-btn px-[16px] py-[9px] text-[calc(11.5px*var(--ts))] tracking-[0.11em]"
          >
            <span>Read the full story</span>
            <span>&rarr;</span>
          </Link>

          <div className="flex flex-wrap items-center gap-[9px] font-mono text-[calc(11.5px*var(--ts))]">
            {projectLinks(project).map((link, i) => (
              <span key={link.label} className="flex items-center gap-[9px]">
                {i > 0 ? <span className="text-ink-faint">&#8599;</span> : null}
                <a href={link.href} target="_blank" rel="noreferrer" className="link-underline">
                  {link.label}
                </a>
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
