import { spawnSync } from "node:child_process";
import { distributionTagForBranch } from "./distribution-tag.mjs";

const branchName = process.env.GITHUB_REF_NAME;
if (!branchName) {
  console.error(
    "GITHUB_REF_NAME is required. This script is the release workflow publish command.",
  );
  process.exit(1);
}

const distributionTag = distributionTagForBranch(branchName);
const result = spawnSync(
  "pnpm",
  ["exec", "changeset", "publish", "--tag", distributionTag],
  {
    stdio: "inherit",
    env: process.env,
  },
);

process.exit(result.status ?? 1);
