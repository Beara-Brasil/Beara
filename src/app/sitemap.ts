import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://beara.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/privacidade`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/termos`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
