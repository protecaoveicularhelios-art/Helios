import { MetadataRoute } from "next"
import { cidades } from "@/data/cidades"

export const dynamic = "force-static"

const LAST_MODIFIED = new Date("2026-06-06")

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://heliosprotecaoveicular.com.br"

  const cidadesUrls = cidades.map((cidade) => ({
    url: `${baseUrl}/${cidade.slug}/`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  return [
    {
      url: `${baseUrl}/`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    ...cidadesUrls,
  ]
}
