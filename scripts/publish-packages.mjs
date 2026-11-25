import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { distributionTagForBranch } from "./distribution-tag.mjs";

/**
 * Arguments for `pnpm exec changeset publish`.
 * Artifact mode stores the dist-tag in publish-plan.json. Passing `--tag`
 * together with `--from-pack-dir` makes Changesets exit.
 *
 * @param {string} packDirectory
 * @returns {string[]}
 */
export function publishArguments(packDirectory) {
    return ["exec", "changeset", "publish", "--from-pack-dir", packDirectory];
}

/**
 * @param {{ plan: { kind?: string, tag?: string }[][] }} planDocument
 * @param {string} distributionTag
 */
export function applyDistributionTagToPlan(planDocument, distributionTag) {
    for (const batch of planDocument.plan) {
        for (const release of batch) {
            if (release.kind === "publish") {
                release.tag = distributionTag;
            }
        }
    }
    return planDocument;
}

/**
 * @param {string} packDirectory
 * @param {string} distributionTag
 */
export function writeDistributionTag(packDirectory, distributionTag) {
    const planPath = path.join(packDirectory, "publish-plan.json");
    const planDocument = JSON.parse(readFileSync(planPath, "utf8"));
    applyDistributionTagToPlan(planDocument, distributionTag);
    writeFileSync(planPath, `${JSON.stringify(planDocument, null, 2)}\n`);
}

function main() {
    const branchName = process.env.GITHUB_REF_NAME;
    if (!branchName) {
        console.error(
            "GITHUB_REF_NAME is required. This script is the release workflow publish command.",
        );
        process.exit(1);
    }
    const packDirectory = process.env.CHANGESET_PACK_DIR;
    if (!packDirectory) {
        console.error(
            "CHANGESET_PACK_DIR is required. Publish the tarballs produced by the pack job.",
        );
        process.exit(1);
    }

    writeDistributionTag(packDirectory, distributionTagForBranch(branchName));
    const result = spawnSync("pnpm", publishArguments(packDirectory), {
        stdio: "inherit",
        env: process.env,
    });
    process.exit(result.status ?? 1);
}

if (
    process.argv[1] &&
    path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
    main();
}
