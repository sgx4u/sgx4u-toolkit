/**
 * Dist-tag for a release branch.
 * production publishes latest, develop publishes beta snapshots,
 * and release/** publishes previous majors.
 *
 * @param {string} branchName
 * @returns {"latest" | "beta" | "previous"}
 */
export function distributionTagForBranch(branchName) {
    if (branchName === "production") {
        return "latest";
    }
    if (branchName === "develop") {
        return "beta";
    }
    if (branchName.startsWith("release/")) {
        return "previous";
    }
    throw new Error(
        `Refusing to publish from branch "${branchName}". Releases run on production, develop, and release/** only.`,
    );
}
