import assert from "node:assert/strict";
import { test } from "node:test";
import { getGitHubProfile } from "../lib/github-profile.ts";

const profile = { login: "ASHMIT-PROG", name: "Ashmit Sharma", bio: null, avatar_url: "https://avatars.githubusercontent.com/u/1", html_url: "https://github.com/ASHMIT-PROG", public_repos: 19, followers: 6, following: 17 };
const repos = [{ id: 1, name: "example", description: null, html_url: "https://github.com/ASHMIT-PROG/example", language: "TypeScript", stargazers_count: 2 }];

test("reads current public profile and repositories without exposing credentials", async (t) => {
  const fetchMock = t.mock.method(globalThis, "fetch", async (url) => Response.json(url.includes("/repos?") ? repos : profile));
  const result = await getGitHubProfile("ASHMIT-PROG");
  assert.equal(result.public_repos, 19);
  assert.equal(result.followers, 6);
  assert.deepEqual(result.repos, repos);
  assert.ok(Date.parse(result.fetchedAt));
  assert.equal(fetchMock.mock.callCount(), 2);
  assert.equal(fetchMock.mock.calls[0].arguments[1].cache, "no-store");
  assert.equal("Authorization" in result, false);
});

test("rejects upstream errors, mismatched accounts, invalid counts and unsafe destinations", async (t) => {
  const fetchMock = t.mock.method(globalThis, "fetch");
  for (const response of [
    new Response(null, { status: 403 }),
    Response.json({ ...profile, login: "someone-else" }),
    Response.json({ ...profile, followers: -1 }),
    Response.json({ ...profile, html_url: "javascript:alert(1)" }),
    Response.json({ ...profile, avatar_url: "https://example.com/photo.png" }),
  ]) {
    fetchMock.mock.mockImplementation(async () => response);
    assert.equal(await getGitHubProfile("ASHMIT-PROG"), null);
  }
});

test("keeps the current profile if optional repository loading fails", async (t) => {
  t.mock.method(globalThis, "fetch", async (url) => url.includes("/repos?") ? new Response(null, { status: 503 }) : Response.json(profile));
  const result = await getGitHubProfile("ASHMIT-PROG");
  assert.equal(result.login, "ASHMIT-PROG");
  assert.deepEqual(result.repos, []);
});
