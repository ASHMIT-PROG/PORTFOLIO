import { access } from "node:fs/promises";
import path from "node:path";

// Optional assets need no code changes. Rebuild after adding files on Vercel.
export async function hasPublicAsset(src: string) {
  if (!src.startsWith("/") || src.includes("..")) return false;
  try { await access(path.join(process.cwd(), "public", src)); return true; } catch { return false; }
}
