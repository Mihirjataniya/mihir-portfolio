import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ImageSlot from "@/components/ImageSlot";
import { masthead } from "@/data/issue";
import {
  getProject,
  projectLinks,
  projectNeighbours,
  projects,
  type Project,
  type ProjectSection,
} from "@/data/projects";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

/** Every project is known at build time, so every article is prerendered. */
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

/** No project, no page — an unknown slug is a 404 rather than a runtime render. */
export const dynamicParams = false;

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return {};

  const title = `${project.title} · STDOUT`;

  return {
    title,
    description: project.dek,
    openGraph: {
      title,
      description: project.dek,
      type: "article",
      images: project.imageSrc ? [{ url: project.imageSrc, alt: project.imageAlt }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const { previous, next } = projectNeighbours(project.slug);

  return (
    <div className="relative z-2 px-[22px] pt-[26px] pb-[30px]">
      <div className="mx-auto max-w-[1444px]">
        <Breadcrumb title={project.title} />

        <article>
          <ArticleHeader project={project} />

          {/* The aspect matches the screenshots' own 1917x865, so `cover` has
              nothing left to trim. Reshoot at that ratio or this starts
              cropping the frame again. */}
          <figure className="mt-[18px]">
            <div className="relative aspect-[1917/865] overflow-hidden border border-rule-55">
              <ImageSlot
                src={project.imageSrc}
                alt={project.imageAlt}
                placeholder={project.imageAlt}
                priority
                sizes="(max-width: 1080px) 94vw, 1400px"
              />
              <div className="halftone opacity-[0.24] [background-image:radial-gradient(circle_at_1px_1px,rgba(20,18,15,.85)_0.7px,transparent_1.1px)]" />
            </div>
            {project.imageCaption ? (
              <figcaption className="mt-[7px] border-b border-rule-30 pb-[7px] font-mono text-[calc(11px*var(--ts))] leading-[1.5] text-ink-mute italic">
                {project.imageCaption}
              </figcaption>
            ) : null}
          </figure>

          <div className="flex flex-col p1080:grid p1080:grid-cols-[minmax(0,1fr)_clamp(calc(268px*var(--ts)),26.5%,calc(352px*var(--ts)))]">
            <main className="order-2 min-w-0 p1080:order-1 p1080:pr-[28px]">
              <ArticleBody project={project} />
            </main>

            <aside className="order-1 mt-[22px] min-w-0 p1080:order-2 p1080:mt-0 p1080:border-l p1080:border-rule-60 p1080:pl-[28px]">
              {/* Nothing is pinned to the top of these pages, so the rail can
                  stick right at the edge and stay readable down a long piece. */}
              <div className="p1080:sticky p1080:top-[18px]">
                <StackSheet project={project} />
              </div>
            </aside>
          </div>
        </article>

        <ContinuedNav previous={previous} next={next} />

        <footer className="mt-[16px] border-t border-ink pt-[10px] text-center font-mono text-[calc(11.5px*var(--ts))] tracking-[0.02em] text-ink-mute">
          &copy; 2026 Mihir Jataniya. All thoughts are my own.
        </footer>
      </div>
    </div>
  );
}

function Breadcrumb({ title }: { title: string }) {
  return (
    <>
      <div className="border-t-4 border-ink" />
      <div className="mt-[3px] border-t border-ink" />

      <nav
        aria-label="Breadcrumb"
        className="mt-[10px] flex flex-wrap items-center gap-[9px] border-b border-rule-45 pb-[10px] font-mono text-[calc(11px*var(--ts))] tracking-[0.1em] text-ink-mute uppercase"
      >
        <Link href="/" className="link-underline">
          STDOUT
        </Link>
        <span className="text-ink-faint">/</span>
        <Link href="/projects" className="link-underline">
          Projects
        </Link>
        <span className="text-ink-faint">/</span>
        <span className="min-w-0 truncate text-ink-3">{title}</span>
      </nav>
    </>
  );
}

function ArticleHeader({ project }: { project: Project }) {
  const links = projectLinks(project);

  return (
    <header className="mt-[18px]">
      <div className="kicker">{project.tags[0]}</div>

      <h1 className="mt-[9px] font-display text-[calc(clamp(32px,5.2vw,68px)*var(--ts))] leading-[1.02] font-semibold tracking-[-0.014em] text-ink">
        {project.title}
      </h1>

      <p className="mt-[13px] max-w-[68ch] font-display text-[calc(clamp(15px,1.9vw,22px)*var(--ts))] leading-[1.44] text-ink-2 italic">
        {project.dek}
      </p>

      <div className="mt-[16px] flex flex-col items-start justify-between gap-[10px] border-y border-ink py-[9px] font-mono text-[calc(11.5px*var(--ts))] tracking-[0.085em] text-ink-3 uppercase p760:flex-row p760:items-center p760:gap-[24px]">
        <div className="flex flex-wrap items-center gap-[9px]">
          <span>
            By <span className="font-semibold text-accent">{masthead.author}</span>
          </span>
          <span className="text-ink-faint">&bull;</span>
          <span>{project.period}</span>
          <span className="text-ink-faint">&bull;</span>
          <span>{project.status}</span>
        </div>

        {links.length > 0 ? (
          <div className="flex flex-wrap items-center gap-[9px] normal-case">
            {links.map((link, i) => (
              <span key={link.label} className="flex items-center gap-[9px]">
                {i > 0 ? <span className="text-ink-faint">&#8599;</span> : null}
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline font-semibold"
                >
                  {link.label}
                </a>
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </header>
  );
}

function ArticleBody({ project }: { project: Project }) {
  return (
    <>
      <Section label={project.brief.heading}>
        {project.brief.body.map((paragraph, i) => (
          <p
            key={paragraph.slice(0, 32)}
            className={`${paragraphClass} ${i > 0 ? "mt-[13px]" : ""} ${
              i === 0
                ? "first-letter:float-left first-letter:pt-[3px] first-letter:pr-[9px] first-letter:font-display first-letter:text-[calc(52px*var(--ts))] first-letter:leading-[0.82] first-letter:font-bold first-letter:text-accent"
                : ""
            }`}
          >
            {paragraph}
          </p>
        ))}
      </Section>

      <Section label="How it is built">
        <div className="grid gap-[22px]">
          {project.build.map((part, i) => (
            <BuildPart key={part.heading} part={part} no={String(i + 1).padStart(2, "0")} />
          ))}
        </div>
      </Section>

      <Section label="What it does">
        <ul className="grid gap-[9px] p-0">
          {project.features.map((feature) => (
            <li
              key={feature.heading}
              className={`grid list-none grid-cols-[13px_minmax(0,1fr)] gap-[7px] ${paragraphClass}`}
            >
              <span aria-hidden="true">&bull;</span>
              <span>
                <strong className="font-semibold text-ink">{feature.heading}:</strong>{" "}
                {feature.body}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Last on the page: the reader needs to know what the thing is and how
          it works before the argument for any given fork means anything. */}
      <Section label="Technical decisions">
        <div className="frame-soft">
          {project.decisions.map((decision, i) => (
            <div
              key={decision.heading}
              className={`px-[15px] py-[13px] ${i > 0 ? "border-t border-rule-45" : ""}`}
            >
              <h3 className="font-display text-[calc(16px*var(--ts))] font-semibold text-ink">
                {decision.heading}
              </h3>

              <dl className="mt-[9px] grid gap-[7px] p600:grid-cols-[62px_minmax(0,1fr)] p600:gap-x-[12px]">
                <dt className={labelClass}>Chose</dt>
                <dd className={`m-0 ${paragraphClass}`}>{decision.choice}</dd>
                <dt className={`${labelClass} mt-[4px] p600:mt-0`}>Why</dt>
                <dd className={`m-0 ${paragraphClass}`}>{decision.rationale}</dd>
              </dl>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

/** Body copy, one place. Every paragraph in the article sets the same measure. */
const paragraphClass = "font-mono text-[calc(12.5px*var(--ts))] leading-[1.72] text-ink-3";

const labelClass =
  "font-mono text-[calc(10.5px*var(--ts))] tracking-[0.11em] text-ink-mute uppercase";

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mt-[24px] border-t border-rule-60 pt-[12px]">
      <div className="kicker">{label}</div>
      <div className="mt-[12px]">{children}</div>
    </section>
  );
}

function BuildPart({ part, no }: { part: ProjectSection; no: string }) {
  return (
    <div className="grid grid-cols-[28px_minmax(0,1fr)] gap-[12px]">
      <div className="pt-[3px] font-mono text-[calc(12.5px*var(--ts))] text-accent">{no}</div>
      <div className="min-w-0">
        <h3 className="font-display text-[calc(clamp(17px,1.7vw,21px)*var(--ts))] font-semibold text-ink">
          {part.heading}
        </h3>
        {part.body.map((paragraph, i) => (
          <p
            key={paragraph.slice(0, 32)}
            className={`${paragraphClass} ${i === 0 ? "mt-[8px]" : "mt-[11px]"}`}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

/**
 * The whole rail. Uses the same narrow label column the front page's stack
 * table does, so values are kept terse for that measure — anything that needs
 * a clause belongs in the article body instead.
 */
function StackSheet({ project }: { project: Project }) {
  return (
    <section className="mt-[22px] p1080:mt-[18px]">
      {/* The heading is the summary below a phone; from p1080 the summary is
          hidden and this kicker takes over, matching every other rail block. */}
      <div className="kicker mb-[11px] hidden p1080:block">The stack</div>

      <details className="stack-fold frame group px-[15px] py-[12px] p1080:pb-[14px]">
        <summary className="flex items-center justify-between gap-[10px]">
          <span className="kicker">The stack</span>
          <span className="flex items-center gap-[7px] font-mono text-[calc(10.5px*var(--ts))] tracking-[0.1em] text-ink-mute uppercase">
            {project.stack.length} rows
            <svg
              viewBox="0 0 24 24"
              width="13"
              height="13"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="transition-transform duration-200 group-open:rotate-180"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </summary>

        <div className="stack-fold-panel pt-[12px] p1080:pt-0">
          <dl className="grid gap-[11px]">
            {project.stack.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[minmax(62px,0.52fr)_minmax(0,1fr)] items-start gap-[10px]"
              >
                <dt className="pt-px font-mono text-[calc(11px*var(--ts))] text-ink-mute">
                  {row.label}
                </dt>
                <dd className="m-0 font-mono text-[calc(11.8px*var(--ts))] leading-[1.5] text-ink-3">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="dash-rule my-[12px]" />

          <div className="flex flex-wrap gap-[4px]">
            {project.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </details>
    </section>
  );
}

/** The "continued on" strip. Empty cells are rendered so the grid stays even. */
function ContinuedNav({ previous, next }: { previous?: Project; next?: Project }) {
  if (!previous && !next) return null;

  return (
    <nav
      aria-label="More projects"
      className="mt-[22px] grid grid-cols-1 border border-rule-70 p600:grid-cols-2"
    >
      <div className="min-w-0 px-[16px] py-[13px]">
        {previous ? (
          <Link href={`/projects/${previous.slug}`} className="group block">
            <div className={labelClass}>&larr; Previous</div>
            <div className="mt-[5px] font-display text-[calc(17px*var(--ts))] font-semibold text-ink group-hover:text-accent">
              {previous.title}
            </div>
          </Link>
        ) : (
          <div className={`${labelClass} opacity-60`}>Start of the section</div>
        )}
      </div>

      <div className="min-w-0 border-t border-rule-55 px-[16px] py-[13px] p600:border-t-0 p600:border-l p600:text-right">
        {next ? (
          <Link href={`/projects/${next.slug}`} className="group block">
            <div className={labelClass}>Next &rarr;</div>
            <div className="mt-[5px] font-display text-[calc(17px*var(--ts))] font-semibold text-ink group-hover:text-accent">
              {next.title}
            </div>
          </Link>
        ) : (
          <div className={`${labelClass} opacity-60`}>End of the section</div>
        )}
      </div>
    </nav>
  );
}
