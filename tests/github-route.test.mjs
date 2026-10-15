import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";

// Resolve the same local alias used by Next.js when importing the real handler.
registerHooks({
  resolve(specifier, context, nextResolve) {
    return nextResolve(specifier.startsWith("@/")
      ? new URL(`../${specifier.slice(2)}.ts`, import.meta.url).href
      : specifier, context);
  },
});
const { GET } = await import("../app/api/github/route.ts");

test("the runtime endpoint never caches failures and recovers with cacheable valid data", async (t) => {
  const previous = process.env.GITHUB_TOKEN;
  delete process.env.GITHUB_TOKEN;
  t.after(() => {
    if (previous === undefined) delete process.env.GITHUB_TOKEN;
    else process.env.GITHUB_TOKEN = previous;
  });
  t.mock.method(console, "warn", () => {});
  const fetchMock = t.mock.method(globalThis, "fetch", async () => new Response(null, { status: 503 }));

  const unavailable = await GET();
  assert.equal(unavailable.status, 503);
  assert.equal(unavailable.headers.get("Cache-Control"), "no-store");
  assert.equal(unavailable.headers.get("Retry-After"), "60");
  assert.deepEqual(await unavailable.json(), { error: "GitHub activity is temporarily unavailable." });

  fetchMock.mock.mockImplementation(async () => new Response(`
    <td id="day" data-date="2026-10-15" data-level="2"></td>
    <tool-tip for="day">3 contributions on October 15th.</tool-tip>
  `));
  const recovered = await GET();
  assert.equal(recovered.status, 200);
  assert.equal(recovered.headers.get("Cache-Control"), "public, max-age=0, s-maxage=300, stale-while-revalidate=3600");
  assert.deepEqual(await recovered.json(), { contributions: [{ date: "2026-10-15", count: 3, level: 2 }] });
});
