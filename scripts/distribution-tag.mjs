/**
 * Dist-tag for a release branch.
 * main publishes latest, next publishes beta, release/** publishes previous.
 *
 * @param {string} branchName
 * @returns {"latest" | "beta" | "previous"}
 */
export function distributionTagForBranch(branchName) {
  if (branchName === "main") {
    return "latest";
  }
  if (branchName === "next") {
    return "beta";
  }
  if (branchName.startsWith("release/")) {
    return "previous";
  }
  throw new Error(
    `Refusing to publish from branch "${branchName}". Releases run on main, next, and release/** only.`,
  );
}
