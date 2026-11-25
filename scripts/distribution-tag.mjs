/**
 * Dist-tag for a branch that publishes the versions committed in package.json.
 *
 * `scripts/publish-packages.mjs` calls this with `GITHUB_REF_NAME`.
 * `production` publishes `latest`. `release/**` publishes `previous`, which
 * is how an older major stays installable without becoming the default.
 * `beta` throws because that branch publishes uncommitted Changesets
 * snapshots from `scripts/publish-beta-snapshot.mjs`. Any other branch,
 * including `develop`, throws because stable releases run on `production`
 * and `release/**` only.
 *
 * @param {string} branchName Branch name, not a full ref. `release/example/v1` is a release branch.
 * @returns {"latest" | "previous"}
 * @throws {Error} When `branchName` is `beta`, or when it is neither `production` nor a `release/` branch. The message names the branch.
 * @example
 * distributionTagForBranch("production")
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
