import assert from "node:assert/strict";
import test from "node:test";
import { distributionTagForBranch } from "./distribution-tag.mjs";

test("release branches map to the three supported dist-tags", () => {
  assert.equal(distributionTagForBranch("main"), "latest");
  assert.equal(distributionTagForBranch("next"), "beta");
  assert.equal(distributionTagForBranch("release/string/v1"), "previous");
});

test("other branches are rejected", () => {
  assert.throws(
    () => distributionTagForBranch("develop"),
    /Refusing to publish/,
  );
});
