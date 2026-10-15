import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const contentType = "image/webp";

export default async function Icon() {
  const avatarPath = join(process.cwd(), "public", "avatar.webp");
  const buf = await readFile(avatarPath);
  return new NextResponse(buf, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
