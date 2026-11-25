import assert from "node:assert/strict";
import test from "node:test";
import { distributionTagForBranch } from "./distribution-tag.mjs";
import {
    applyDistributionTagToPlan,
    publishArguments,
} from "./publish-packages.mjs";

test("stable release branches map to latest and previous", () => {
    assert.equal(distributionTagForBranch("production"), "latest");
    assert.equal(distributionTagForBranch("release/string/v1"), "previous");
});

test("develop and beta do not publish committed versions", () => {
    assert.throws(
        () => distributionTagForBranch("develop"),
        /Refusing to publish/,
    );
    assert.throws(
        () => distributionTagForBranch("beta"),
        /Refusing to publish committed versions/,
    );
});

test("other branches are rejected", () => {
    assert.throws(
        () => distributionTagForBranch("main"),
        /Refusing to publish/,
    );
});

test("packed publishes do not pass --tag", () => {
    assert.deepEqual(publishArguments("packed-packages"), [
        "exec",
        "changeset",
        "publish",
        "--from-pack-dir",
        "packed-packages",
    ]);
});

test("the publish plan carries the branch dist-tag", () => {
    const planDocument = {
        version: 1,
        plan: [
            [
                {
                    kind: "publish",
                    name: "@sgx4u/string",
                    version: "1.2.0",
                    tag: "latest",
                },
            ],
        ],
    };
    applyDistributionTagToPlan(planDocument, "previous");
    assert.equal(planDocument.plan[0][0].tag, "previous");
});
