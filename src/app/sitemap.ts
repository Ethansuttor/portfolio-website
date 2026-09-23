import type { MetadataRoute } from "next";
import { allProjects } from "@/lib/projects";
import { buildLog } from "@/lib/buildLog";
import { BUILD_LOG_HREF, SITE_URL } from "@/lib/site";

/**
 * `lastModified` is only set where there's a real date to give. Stamping every
 * URL with the build time told crawlers the whole site changed on every
 * deploy, and Google stops trusting lastmod from a sitemap that does that.
 * The build log's date is its newest entry.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/projects`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}${BUILD_LOG_HREF}`,
      lastModified: buildLog[0]?.date,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...allProjects.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
