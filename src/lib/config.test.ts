import assert from "node:assert/strict";
import test from "node:test";
import { absoluteSiteUrl, normalizeSiteOrigin } from "./config";

test("normalizes a configured origin and preserves a path", () => {
  assert.equal(normalizeSiteOrigin("https://example.com/"), "https://example.com");
  assert.equal(
    absoluteSiteUrl("/services", "https://example.com/"),
    "https://example.com/services",
  );
});
