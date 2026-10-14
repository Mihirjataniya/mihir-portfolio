/**
 * Every published post, newest first. The /blogs list, the sitemap and each
 * post's own header and metadata all read from here, so a title or date only
 * ever lives in one place.
 */
export type Post = {
  slug: string;
  title: string;
  /** Subtitle under the headline; also the meta description. */
  dek: string;
  /** ISO date, YYYY-MM-DD. */
  published: string;
  readMinutes: number;
  tags: readonly string[];
};

const postList = [
  {
    slug: "from-server-1-to-n",
    title: "From Server 1 to N",
    dek: "Nine things that break the moment you add the second one. Your error tracker won’t show you any of them.",
    published: "2026-10-14",
    readMinutes: 13,
    tags: ["System design", "Scaling", "Redis"],
  },
  {
    slug: "from-prompt-to-bill",
    title: "From Prompt to Bill: The Life of One LLM Call",
    dek: "One line of code, half a second of waiting, and a bill at the end of the month. What actually happens in between, from tokens to tail latency.",
    published: "2026-10-05",
    readMinutes: 14,
    tags: ["LLMs", "Latency", "Cost"],
  },
] as const satisfies readonly Post[];

export type PostSlug = (typeof postList)[number]["slug"];

export const posts: readonly Post[] = postList;

export function getPost(slug: PostSlug): Post {
  return posts.find((post) => post.slug === slug)!;
}

/** "2026-10-05" → "October 5, 2026", fixed to UTC so server and client agree. */
export function formatPostDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
