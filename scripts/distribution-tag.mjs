/**
 * Dist-tag for a branch that publishes the versions committed in package.json.
 * production publishes latest. release/** publishes previous.
 * beta publishes uncommitted Changesets snapshots from publish-beta-snapshot.mjs.
 * develop does not publish.
 *
 * @param {string} branchName
 * @returns {"latest" | "previous"}
 */
export function distributionTagForBranch(branchName) {
    if (branchName === "production") {
        return "latest";
    }
    if (branchName.startsWith("release/")) {
        return "previous";
    }
    if (branchName === "beta") {
        throw new Error(
            'Refusing to publish committed versions from "beta". That branch publishes uncommitted Changesets snapshots to the beta dist-tag.',
        );
    }
    throw new Error(
        `Refusing to publish from branch "${branchName}". Stable releases run on production and release/** only. develop does not publish.`,
    );
}
