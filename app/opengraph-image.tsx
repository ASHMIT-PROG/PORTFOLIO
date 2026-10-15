import { ImageResponse } from "next/og";
import { site } from "@/data/site";
export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ display: "flex", width: "100%", height: "100%", background: "#0e0e0d", padding: "60px 80px", color: "#f4f3f0", fontFamily: "sans-serif" }}><div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", borderLeft: "1px dashed #3e413a", borderRight: "1px dashed #3e413a", padding: "24px 40px" }}><div style={{ display: "flex", color: "#afbeaa", fontSize: 26 }}>{site.wordmark}</div><div style={{ display: "flex", flexDirection: "column", gap: 22 }}><div style={{ display: "flex", fontSize: 88, letterSpacing: -4 }}>{site.name}</div><div style={{ display: "flex", fontSize: 30, color: "#aaa9a3" }}>{site.role}</div></div><div style={{ display: "flex", fontSize: 20, color: "#888a82" }}>{site.githubUrl.replace("https://", "")}</div></div></div>, size);
}
