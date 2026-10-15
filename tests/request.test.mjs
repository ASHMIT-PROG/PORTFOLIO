import assert from "node:assert/strict";
import { test } from "node:test";
import { readLimitedJson, sameOrigin } from "../lib/request.ts";

const url = "http://localhost:3000/api/contact";
const jsonRequest = (body, type = "application/json", headers = {}) => new Request(url, {
  method: "POST", body, headers: { "content-type": type, ...headers },
});

test("accepts JSON with charset and case-insensitive media type", async () => {
  assert.deepEqual(await readLimitedJson(jsonRequest('{"message":"hello"}', "Application/JSON; charset=utf-8")), { message: "hello" });
});

test("rejects media types that only start with application/json", async () => {
  for (const type of ["application/jsonp", "application/json-malformed", "text/plain"]) {
    await assert.rejects(readLimitedJson(jsonRequest("{}", type)), /Unsupported content type/);
  }
});

test("enforces actual UTF-8 byte limit even without Content-Length", async () => {
  const body = JSON.stringify({ text: "😀".repeat(20) });
  await assert.rejects(readLimitedJson(jsonRequest(body), 50), /Body too large/);
  assert.deepEqual(await readLimitedJson(jsonRequest(body), 100), JSON.parse(body));
});

test("rejects oversized declared length and malformed JSON", async () => {
  await assert.rejects(readLimitedJson(jsonRequest("{}", "application/json", { "content-length": "24001" })), /Body too large/);
  await assert.rejects(readLimitedJson(jsonRequest("{broken")), SyntaxError);
});

test("allows same-origin requests and rejects cross-site submissions", () => {
  assert.equal(sameOrigin(new Request(url)), true);
  assert.equal(sameOrigin(new Request(url, { headers: { origin: "http://localhost:3000" } })), true);
  assert.equal(sameOrigin(new Request(url, { headers: { origin: "https://example.com" } })), false);
  assert.equal(sameOrigin(new Request(url, { headers: { "sec-fetch-site": "cross-site" } })), false);
});
