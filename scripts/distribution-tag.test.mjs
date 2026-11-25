import assert from "node:assert/strict";
import test from "node:test";
import { distributionTagForBranch } from "./distribution-tag.mjs";
import { publishArguments } from "./publish-packages.mjs";

test("release branches map to the three supported dist-tags", () => {
  assert.equal(distributionTagForBranch("production"), "latest");
  assert.equal(distributionTagForBranch("develop"), "beta");
  assert.equal(distributionTagForBranch("release/string/v1"), "previous");
});

test("other branches are rejected", () => {
  assert.throws(
    () => distributionTagForBranch("main"),
    /Refusing to publish/,
  );
});

test("publish uses the packed directory and the branch dist-tag", () => {
  assert.deepEqual(publishArguments("production", "packed-packages"), [
    "exec",
    "changeset",
    "publish",
    "--tag",
    "latest",
    "--from-pack-dir",
    "packed-packages",
  ]);
  assert.equal(
    publishArguments("release/string/v1", "packed-packages").at(4),
    "previous",
  );
});
