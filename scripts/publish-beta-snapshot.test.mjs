import assert from "node:assert/strict";
import test from "node:test";
import {
  packagesWithChangedVersions,
  readPackageVersions,
} from "./publish-beta-snapshot.mjs";

test("snapshot publish only includes packages whose version changed", () => {
  const versionsBefore = new Map([
    ["@sgx4u/string", "0.1.0"],
    ["@sgx4u/tsconfig", "0.1.0"],
  ]);
  const versionsAfter = new Map([
    ["@sgx4u/string", "0.1.0-beta-20261125120000"],
    ["@sgx4u/tsconfig", "0.1.0"],
  ]);
  assert.deepEqual(packagesWithChangedVersions(versionsBefore, versionsAfter), [
    { packageName: "@sgx4u/string", version: "0.1.0-beta-20261125120000" },
  ]);
});

test("the repository versions can be read without publishing", () => {
  const versions = readPackageVersions(new URL("..", import.meta.url).pathname);
  assert.equal(versions.get("@sgx4u/string"), "0.0.0");
});
