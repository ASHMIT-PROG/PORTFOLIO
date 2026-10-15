import assert from "node:assert/strict";
import { test } from "node:test";
import { getContributions } from "../lib/github.ts";

// Mirrors GitHub's calendar cells and linked tooltips, deliberately out of date order.
const publicCalendar = `
  <td class="ContributionCalendar-day" data-date="2026-10-13" id="day-2" data-level="4"></td>
  <td id='day-1' data-level='1' data-date='2026-10-12'></td>
  <td data-date="2026-10-11" data-level="0" id="day-0"></td>
  <td class="ContributionCalendar-day"></td>
  <tool-tip for="day-0">No contributions on October 11th.</tool-tip>
  <tool-tip id="tip-2" for="day-2">1,234 contributions on October 13th.</tool-tip>
  <tool-tip for="day-1">1 contribution on October 12th.</tool-tip>
`;
const expected = [
  { date: "2026-10-11", count: 0, level: 0 },
  { date: "2026-10-12", count: 1, level: 1 },
  { date: "2026-10-13", count: 1234, level: 4 },
];
const graphResponse = {
  data: { user: { contributionsCollection: { contributionCalendar: {
    totalContributions: 3,
    weeks: [{ contributionDays: [{ date: "2026-10-12", contributionCount: 3, contributionLevel: "SECOND_QUARTILE" }] }],
  } } } },
};

function configureToken(t, value) {
  const previous = process.env.GITHUB_TOKEN;
  if (value === undefined) delete process.env.GITHUB_TOKEN;
  else process.env.GITHUB_TOKEN = value;
  t.after(() => {
    if (previous === undefined) delete process.env.GITHUB_TOKEN;
    else process.env.GITHUB_TOKEN = previous;
  });
  return t.mock.method(console, "warn", () => {});
}

test("loads public contributions without a token, sorted with accurate counts", async (t) => {
  configureToken(t, undefined);
  const fetchMock = t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, "https://github.com/users/ASHMIT-PROG/contributions");
    assert.equal(options.headers.Authorization, undefined);
    assert.equal(options.headers["Accept-Language"], "en-US");
    assert.equal(options.cache, "no-store");
    assert.equal(options.next, undefined);
    return new Response(publicCalendar);
  });
  assert.deepEqual(await getContributions("ASHMIT-PROG"), expected);
  assert.equal(fetchMock.mock.callCount(), 1);
});

test("prefers GraphQL with a trimmed token and preserves contribution levels", async (t) => {
  configureToken(t, " test-token ");
  const fetchMock = t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, "https://api.github.com/graphql");
    assert.equal(options.headers.Authorization, "Bearer test-token");
    assert.equal(options.cache, "no-store");
    assert.equal(JSON.parse(options.body).variables.login, "ASHMIT-PROG");
    return Response.json(graphResponse);
  });
  assert.deepEqual(await getContributions("ASHMIT-PROG"), [{ date: "2026-10-12", count: 3, level: 2 }]);
  assert.equal(fetchMock.mock.callCount(), 1);
});

test("falls back after rejected, rate-limited, malformed, empty, or timed-out GraphQL requests", async (t) => {
  const warnings = configureToken(t, "test-token");
  const failures = [
    () => new Response(null, { status: 401 }),
    () => new Response(null, { status: 429 }),
    () => Response.json({ errors: [{ message: "Bad credentials" }] }),
    () => new Response("invalid json"),
    () => Response.json({ data: { user: { contributionsCollection: { contributionCalendar: { totalContributions: 0, weeks: [] } } } } }),
    () => { throw new DOMException("Timed out", "TimeoutError"); },
  ];
  const fetchMock = t.mock.method(globalThis, "fetch");
  for (const fail of failures) {
    fetchMock.mock.mockImplementation(async (url, options) => {
      if (url === "https://api.github.com/graphql") return fail();
      assert.equal(options.headers.Authorization, undefined, "never forward the token to the public endpoint");
      return new Response(publicCalendar);
    });
    assert.deepEqual(await getContributions("ASHMIT-PROG"), expected);
  }
  assert.ok(warnings.mock.calls.every(({ arguments: args }) => !args.join(" ").includes("test-token")));
});

test("returns null for unavailable or invalid public data without throwing", async (t) => {
  configureToken(t, "   ");
  const fetchMock = t.mock.method(globalThis, "fetch");
  const failures = [
    () => new Response(null, { status: 503 }),
    () => { throw new Error("offline"); },
    () => new Response("<html>Sign in</html>"),
    () => new Response(publicCalendar.replace("1 contribution on", "Unknown contributions on")),
    () => new Response(publicCalendar.replace('data-level="4"', 'data-level="9"')),
    () => new Response(publicCalendar.replace("2026-10-13", "2026-02-30")),
    () => new Response(publicCalendar.replace("2026-10-13", "2026-10-12")),
  ];
  for (const fail of failures) {
    fetchMock.mock.mockImplementation(async () => fail());
    assert.equal(await getContributions("ASHMIT-PROG"), null);
  }
});

test("returns null when both sources fail so the rest of the page can render", async (t) => {
  configureToken(t, "test-token");
  const fetchMock = t.mock.method(globalThis, "fetch", async () => { throw new Error("offline"); });
  assert.equal(await getContributions("ASHMIT-PROG"), null);
  assert.equal(fetchMock.mock.callCount(), 2);
});

test("a failed request can recover on retry without retaining a failed payload", async (t) => {
  configureToken(t, undefined);
  let available = false;
  const fetchMock = t.mock.method(globalThis, "fetch", async (_url, options) => {
    assert.equal(options.cache, "no-store");
    return new Response(available ? publicCalendar : "<html>Temporarily unavailable</html>");
  });
  assert.equal(await getContributions("ASHMIT-PROG"), null);
  available = true;
  assert.deepEqual(await getContributions("ASHMIT-PROG"), expected);
  assert.equal(fetchMock.mock.callCount(), 2);
});
