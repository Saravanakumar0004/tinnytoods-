import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = process.env.BASE_URL;

const routes = [
  { path: "/",             priority: "1.0", changefreq: "weekly"  },
  { path: "/services",     priority: "0.9", changefreq: "monthly" },
  { path: "/booking",      priority: "0.9", changefreq: "monthly" },
  { path: "/about-us",     priority: "0.8", changefreq: "monthly" },
  { path: "/branches",     priority: "0.8", changefreq: "monthly" },
  { path: "/contact",      priority: "0.8", changefreq: "monthly" },
  { path: "/about-autism", priority: "0.8", changefreq: "monthly" },
  { path: "/gallery",      priority: "0.7", changefreq: "weekly"  },
  { path: "/videos",       priority: "0.7", changefreq: "weekly"  },
  { path: "/quiz",         priority: "0.7", changefreq: "monthly" },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(({ path, priority, changefreq }) => `
  <url>
    <loc>${BASE_URL}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join("")}
</urlset>`;

fs.writeFileSync("./public/sitemap.xml", sitemap);
console.log("sitemap.xml generated successfully!");
