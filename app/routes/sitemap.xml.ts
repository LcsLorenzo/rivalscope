import { createFileRoute } from "@tanstack/react-router";

const BASE_URL = "https://rivalscope.com";

const STATIC_PAGES = [
  { path: "/",          priority: "1.0", changefreq: "weekly"  },
  { path: "/pricing",   priority: "0.9", changefreq: "monthly" },
  { path: "/blog",      priority: "0.8", changefreq: "weekly"  },
  { path: "/changelog", priority: "0.7", changefreq: "weekly"  },
];

export const Route = createFileRoute("/sitemap/xml")({
  server: {
    handlers: {
      GET: () => {
        const now = new Date().toISOString().split("T")[0];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${STATIC_PAGES.map(
  ({ path, priority, changefreq }) => `  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
).join("\n")}
</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml" },
        });
      },
    },
  },
});
