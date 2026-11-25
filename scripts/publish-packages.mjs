import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { distributionTagForBranch } from "./distribution-tag.mjs";

/**
 * Arguments for `pnpm exec changeset publish`.
 * When packDirectory is set, publish the tarballs the pack job already reviewed.
 *
 * @param {string} branchName
 * @param {string | undefined} packDirectory
 * @returns {string[]}
 */
export function publishArguments(branchName, packDirectory) {
  const distributionTag = distributionTagForBranch(branchName);
  const args = ["exec", "changeset", "publish", "--tag", distributionTag];
  if (packDirectory) {
    args.push("--from-pack-dir", packDirectory);
  }
  return args;
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

  const result = spawnSync(
    "pnpm",
    publishArguments(branchName, packDirectory),
    {
      stdio: "inherit",
      env: process.env,
    },
  );

  process.exit(result.status ?? 1);
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main();
}
