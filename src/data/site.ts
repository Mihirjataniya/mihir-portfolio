import { contact, masthead } from "@/data/issue";

/**
 * Everything the crawlers and the social cards read.
 *
 * `url` is the single source of truth for the production origin: canonicals,
 * the sitemap, robots and every absolute OG image URL derive from it. Change it
 * in one place if the domain ever moves.
 */
export const SITE = {
  url: "https://mihir.site",
  name: masthead.name,
  author: masthead.author,
  jobTitle: "Backend and real-time systems engineer",
  locale: "en_US",
  /** Handle without the leading @, used to build both the profile URL and the card tag. */
  twitterHandle: "devwithdelulu",
  description:
    "A personal engineering newspaper. Backend, real-time systems and infrastructure work by Mihir Jataniya.",
} as const;

/** Absolute URL for a site-relative path. */
export function absUrl(path = "/"): string {
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Profiles that belong to the same person as this site. Search engines use
 * `sameAs` to tie the site to an existing entity rather than guessing.
 */
export const sameAs = [contact.github.href, contact.linkedin.href, contact.x.href];
