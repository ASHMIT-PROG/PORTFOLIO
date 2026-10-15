import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
export default function sitemap(): MetadataRoute.Sitemap { return ["", "/projects", "/experience", "/contact"].map((path) => ({ url: `${getSiteUrl()}${path}`, changeFrequency: "monthly", priority: path ? 0.7 : 1 })); }
