import type { MetadataRoute } from "next";
import { posts } from "@/data/blogs";
import { projects } from "@/data/projects";
import { absUrl } from "@/data/site";

/**
 * Generated from the project and post lists rather than hand-maintained, so
 * publishing either is the only step needed to get it into the sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: absUrl("/"), lastModified, changeFrequency: "monthly", priority: 1 },
    { url: absUrl("/projects"), lastModified, changeFrequency: "monthly", priority: 0.9 },
    ...projects.map((project) => ({
      url: absUrl(`/projects/${project.slug}`),
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
    { url: absUrl("/blogs"), lastModified, changeFrequency: "monthly", priority: 0.9 },
    ...posts.map((post) => ({
      url: absUrl(`/blogs/${post.slug}`),
      lastModified: new Date(`${post.published}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
