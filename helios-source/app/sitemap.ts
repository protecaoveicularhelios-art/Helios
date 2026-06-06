import { MetadataRoute } from "next"
import { cidades } from "@/data/cidades"
import { artigos } from "@/data/artigos"

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

  const blogUrls = artigos.map((artigo) => ({
    url: `${baseUrl}/blog/${artigo.slug}/`,
    lastModified: new Date(artigo.data),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  return [
    {
      url: `${baseUrl}/`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog/`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    ...cidadesUrls,
    ...blogUrls,
  ]
}
