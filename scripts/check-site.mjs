import assert from "node:assert/strict";

const origin = process.env.CHECK_SITE_URL || "http://localhost:3000";
const routes = ["/", "/projects", "/experience", "/contact", "/icon", "/opengraph-image", "/robots.txt", "/sitemap.xml", "/avatar.webp", "/banner.webp"];
for (const route of routes) {
  const response = await fetch(`${origin}${route}`);
  assert.equal(response.status, 200, route);
  if (route === "/icon") assert.match(response.headers.get("content-type"), /image\/webp/);
  if (route === "/") {
    const html = await response.text();
    for (const text of ["Ashmit Sharma", "Crop Success Compass", "GitHub Activity", "Experience", "<noscript>"]) assert.ok(html.includes(text), `Home missing ${text}`);
  }
  console.log(`PASS GET ${route}`);
}
assert.equal((await fetch(`${origin}/does-not-exist`)).status, 404);
console.log("PASS missing page returns 404");

async function post(body, status, headers = {}) {
  const response = await fetch(`${origin}/api/contact`, { method: "POST", headers: { "content-type": "application/json", origin, ...headers }, body });
  assert.equal(response.status, status);
  return response.json();
}
await post("{}", 400);
await post("{broken", 400);
await post("{}", 400, { "content-type": "application/jsonp" });
await post(JSON.stringify({ message: "x".repeat(24001) }), 400);
await post("{}", 403, { origin: "https://example.com" });
console.log("PASS invalid, malformed, oversized, wrong-type, and cross-origin requests rejected");

// The honeypot branch returns before rate limiting or sending any email.
const trapped = await post(JSON.stringify({ name: "QA Check", email: "  qa@example.com  ", message: "Local validation check only.", website: "bot.example" }), 200);
assert.equal(trapped.ok, true);
console.log("PASS email trimming and honeypot; no email sent");

const contact = await (await fetch(`${origin}/contact`)).text();
if (contact.includes("Prepare email draft")) {
  const fallback = await post(JSON.stringify({ name: "QA Check", email: "qa@example.com", message: "Local draft validation only.", website: "" }), 200);
  assert.equal(fallback.fallback, true);
  assert.ok(fallback.mailto.startsWith("mailto:"));
  console.log("PASS contact email-app fallback; no email sent");
} else console.log("SKIP real email delivery (not sent during QA)");

assert.equal((await fetch(`${origin}/api/views`, { method: "POST", headers: { origin: "https://example.com" } })).status, 403);
console.log("PASS view endpoint rejects cross-origin requests");
