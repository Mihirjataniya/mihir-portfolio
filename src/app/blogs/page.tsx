import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { formatPostDate, posts, type Post } from "@/data/blogs";
import { SITE, absUrl } from "@/data/site";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Long-form writing by Mihir Jataniya on system design, LLMs and engineering: how things are put together and what each choice costs.",
  alternates: { canonical: "/blogs" },
  openGraph: {
    title: `Blogs · ${SITE.author}`,
    description: "System design, engineering, and whatever else is worth writing down.",
    url: "/blogs",
    type: "website",
  },
};

const collectionLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": absUrl("/blogs"),
  name: "Blogs",
  description: "System design, engineering, and whatever else is worth writing down.",
  inLanguage: "en",
  isPartOf: { "@id": absUrl("/#website") },
  about: { "@id": absUrl("/#person") },
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: posts.length,
    itemListElement: posts.map((post, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: post.title,
      description: post.dek,
      url: absUrl(`/blogs/${post.slug}`),
    })),
  },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: SITE.name, item: absUrl("/") },
    { "@type": "ListItem", position: 2, name: "Blogs", item: absUrl("/blogs") },
  ],
};

export default function BlogsPage() {
  return (
    <div className="relative z-2 px-[22px] pt-[26px] pb-[30px]">
      <JsonLd data={collectionLd} />
      <JsonLd data={breadcrumbLd} />

      <div className="mx-auto max-w-[1444px]">
        <header>
          <div className="border-t-4 border-ink" />
          <div className="mt-[3px] border-t border-ink" />

          <div className="mt-[10px] flex items-baseline justify-between gap-[16px] font-mono text-[calc(11.5px*var(--ts))] tracking-[0.11em] text-ink-mute uppercase">
            <Link
              href="/"
              className="nameplate text-[calc(24px*var(--ts))] leading-none tracking-[0.02em] text-ink normal-case"
            >
              STDOUT
            </Link>
            <span className="text-right">
              Section C &middot; {posts.length} {posts.length === 1 ? "post" : "posts"}
            </span>
          </div>

          <h1 className="mt-[14px] text-center font-display text-[calc(clamp(38px,7vw,86px)*var(--ts))] leading-[0.98] font-semibold tracking-[-0.012em] text-ink">
            Blogs
          </h1>

          <div className="mt-[16px] grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-[12px] p600:gap-[18px]">
            <DoubleRule />
            <div className="max-w-[62ch] text-center font-display text-[calc(clamp(13px,1.5vw,17px)*var(--ts))] leading-[1.5] text-ink-2 italic">
              System design, engineering, and whatever else is worth writing down
              properly.
            </div>
            <DoubleRule />
          </div>
        </header>

        <main className="mt-[24px] border-t border-ink">
          {posts.map((post, i) => (
            <PostEntry key={post.slug} post={post} no={posts.length - i} />
          ))}
        </main>

        <div className="mt-[18px] flex flex-wrap items-center justify-between gap-[12px] border-t border-rule-60 pt-[12px]">
          <span className="font-mono text-[calc(11.5px*var(--ts))] text-ink-mute italic">
            More copy is with the typesetter.
          </span>
          <div className="flex flex-wrap items-center gap-[12px]">
            <Link
              href="/projects"
              className="press-btn px-[17px] py-[9px] text-[calc(11.5px*var(--ts))] tracking-[0.11em]"
            >
              <span>Read the projects</span>
              <span>&rarr;</span>
            </Link>
            <Link
              href="/"
              className="link-underline font-mono text-[calc(11.5px*var(--ts))] tracking-[0.06em] text-ink-mute"
            >
              Back to the front page
            </Link>
          </div>
        </div>

        <footer className="mt-[16px] border-t border-ink pt-[10px] text-center font-mono text-[calc(11.5px*var(--ts))] tracking-[0.02em] text-ink-mute">
          &copy; 2026 Mihir Jataniya. All thoughts are my own.
        </footer>
      </div>
    </div>
  );
}

/** One post on the list: numbered oldest-first, so a post keeps its number as new ones land. */
function PostEntry({ post, no }: { post: Post; no: number }) {
  const href = `/blogs/${post.slug}`;

  return (
    <article className="border-b border-rule-55 py-[clamp(18px,2.2vw,28px)]">
      <div className="flex flex-wrap items-baseline gap-x-[10px] gap-y-[4px] font-mono text-[calc(11px*var(--ts))] tracking-[0.09em] text-ink-mute uppercase">
        <span>{String(no).padStart(2, "0")}</span>
        <span className="text-ink-faint">&bull;</span>
        <time dateTime={post.published}>{formatPostDate(post.published)}</time>
        <span className="text-ink-faint">&bull;</span>
        <span>{post.readMinutes} min read</span>
      </div>

      <h2 className="mt-[7px] max-w-[24ch] font-display text-[calc(clamp(24px,3vw,38px)*var(--ts))] leading-[1.08] font-semibold tracking-[-0.008em] text-ink">
        <Link href={href} className="hover:text-accent">
          {post.title}
        </Link>
      </h2>

      <p className="mt-[9px] max-w-[70ch] font-display text-[calc(clamp(14px,1.5vw,17px)*var(--ts))] leading-[1.5] text-ink-2 italic">
        {post.dek}
      </p>

      <div className="mt-[12px] flex flex-wrap gap-[4px]">
        {post.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-[14px]">
        <Link
          href={href}
          className="press-btn px-[16px] py-[9px] text-[calc(11.5px*var(--ts))] tracking-[0.11em]"
        >
          <span>Read the post</span>
          <span>&rarr;</span>
        </Link>
      </div>
    </article>
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
