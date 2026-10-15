import assert from "node:assert/strict";
import { test } from "node:test";
import { getViewCount } from "../lib/view-count.ts";

test("concurrent mounts share one increment request, then allow later visits", async (t) => {
  let release;
  const fetchMock = t.mock.method(globalThis, "fetch", () => new Promise((resolve) => { release = resolve; }));
  const first = getViewCount();
  const second = getViewCount();
  assert.equal(first, second);
  assert.equal(fetchMock.mock.callCount(), 1);
  release(Response.json({ count: 42 }));
  assert.equal(await first, 42);
  assert.equal(await second, 42);
  const later = getViewCount();
  assert.equal(fetchMock.mock.callCount(), 2);
  release(Response.json({ count: 42 }));
  assert.equal(await later, 42);
});

test("failed requests are safe to retry and invalid counts stay hidden", async (t) => {
  const fetchMock = t.mock.method(globalThis, "fetch", async () => { throw new Error("offline"); });
  assert.equal(await getViewCount(), null);
  fetchMock.mock.mockImplementation(async () => Response.json({ count: -1 }));
  assert.equal(await getViewCount(), null);
  fetchMock.mock.mockImplementation(async () => Response.json({ count: 0 }));
  assert.equal(await getViewCount(), 0);
});
