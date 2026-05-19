import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://godo-dev.nu";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/my-events", "/create-event", "/quick-create"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
