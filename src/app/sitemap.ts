import type { MetadataRoute } from "next";

const SITE_URL = "https://www.shinaadedokun.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/about", "/portfolio", "/contact"];

  return routes.map((route) => ({
    url: new URL(route, SITE_URL).toString(),
  }));
}