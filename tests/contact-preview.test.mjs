import assert from "node:assert/strict";
import { test } from "node:test";
import { copyContactEmail, positionContactPreview } from "../lib/contact-preview.ts";

test("email copy writes the exact address and reports unavailable or denied clipboard access", async () => {
  let value = "";
  assert.equal(await copyContactEmail("ashmitsha09@gmail.com", { writeText: async (text) => { value = text; } }), true);
  assert.equal(value, "ashmitsha09@gmail.com");
  assert.equal(await copyContactEmail(value), false);
  assert.equal(await copyContactEmail(value, { writeText: async () => { throw new Error("Permission denied"); } }), false);
});

test("contact preview prefers above when it clears the sticky header", () => {
  const result = positionContactPreview({ left: 400, right: 600, top: 600, bottom: 668 }, 360, 320, 1280, 900);
  assert.equal(result.side, "above");
  assert.equal(result.top, 266);
});

test("contact preview flips below near the top and clamps either horizontal edge", () => {
  for (const [left, right] of [[0, 120], [1200, 1280]]) {
    const result = positionContactPreview({ left, right, top: 100, bottom: 168 }, 360, 320, 1280, 900);
    assert.equal(result.side, "below");
    assert.equal(result.top, 182);
    assert.ok(result.left >= 12);
    assert.ok(result.left + result.width <= 1268);
  }
});

test("contact preview fits narrow and short viewports with scrollable content", () => {
  for (const [width, height] of [[320, 568], [390, 400], [768, 300]]) {
    const result = positionContactPreview({ left: 100, right: 250, top: 180, bottom: 248 }, 360, 600, width, height);
    assert.ok(result.left >= 12);
    assert.ok(result.left + result.width <= width - 12);
    assert.ok(result.top >= 80);
    assert.ok(result.top + Math.min(600, result.maxHeight) <= height - 12);
    assert.ok(result.side === "above" ? result.top + Math.min(600, result.maxHeight) <= 166 : result.top >= 262);
  }
});
