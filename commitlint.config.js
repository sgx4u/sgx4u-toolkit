/**
 * Commit message rules for this repository.
 *
 * Conventional Commits. A message that starts with `chore: version packages`
 * skips the rules because the release workflow generates that commit, and a
 * local run of the version script produces the same subject.
 */
export default {
    extends: ["@commitlint/config-conventional"],
    ignores: [
        (commitMessage) => commitMessage.startsWith("chore: version packages"),
    ],
};
