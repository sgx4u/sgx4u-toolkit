# Changesets

Published packages version independently. `baseBranch` is `develop`. `access` is `public`. `updateInternalDependencies` is `minor`, so a minor bump of a workspace dependency also bumps published packages that depend on it.

`packages/config` is private workspace tooling. Those packages are not published, not versioned, and do not get a changelog. `privatePackages.version` and `privatePackages.tag` are both false, so Changesets skips every package with `"private": true`. An `ignore` list would repeat those names and would have to be edited for each new preset. The private flag is the publish gate, and it already covers a preset added later.

## When a changeset is required

A changeset is required when a published package changes in a way a caller can notice:

- behavior, exports, or types (`packages/<name>/src`, excluding tests, and other files the package publishes)
- `dependencies`, `peerDependencies`, or `optionalDependencies`
- `engines`
- `exports`, `files`, `bin`, `main`, `module`, or `types`

A changeset is not required for README and other docs, comments, tests, internal refactors that do not change behavior, CI, or repository scripts. `packages/config` never needs one.

`node scripts/check-changeset.mjs --base origin/develop` enforces this on pull requests. It compares the branch with the base ref. A published package needs a new or updated changeset in that diff when one of its user-visible files changed. A changeset that was already on the base branch does not cover a new change.

Before the first publish, keep a single changeset for the package and edit it so the notes describe what will ship.

When a diff touches `src` but callers see no change, add the `no-changeset` label. The check then skips coverage for that pull request. The label does not skip the changelog format check. Do not use it for an API, type, dependency, or engine change.

## How to write one

`pnpm changeset` creates the file. Set the bump in the frontmatter: `patch`, `minor`, or `major`. While the package is `0.x`, a breaking change uses `minor`. From `1.0.0`, a breaking change uses `major`.

Each entry starts with a category tag. The categories, in changelog order, are `Breaking`, `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, and `Security`. The text starts with the export or option in backticks and says what the caller sees. `Summary:` is one sentence for the version. `Pull request:` is the pull request number when you already know it.

```md
---
"@sgx4u/<name>": minor
---

Summary: First release of the package.

Added: `formatLabel` returns the label callers display.
```

A `Breaking` entry puts the migration snippet in a fence after the first line:

````md
Breaking: `formatLabel` requires `locale`.

```js
formatLabel({ locale: "en" });
```

Pass `locale`. Callers that omitted it used the runtime default.
````

`node scripts/version-packages.mjs` runs `changeset version`, then groups the entries. The release workflow uses that command. Changesets wraps each note under Major, Minor, and Patch headings, and one `getReleaseLine` call cannot see the other notes in the version. The module writes a tagged block per entry. The version script replaces those headings with the category sections, puts the date on the version heading, and keeps only the categories that have entries. `.changeset/config.json` sets `format` to false so that rewrite sees the tags intact, then the script formats the finished changelog.

The changelog path is `../scripts/changelog-format.mjs` because Changesets resolves it from `.changeset/`, not from the repository root.

A pull request link uses `Pull request: 123` when that line is present. Otherwise the script reads the commit that added the changeset and, when the subject ends with `(#123)`, links that pull request. Otherwise it links the commit. Versioning stays offline and does not need a token. `@changesets/get-github-info` would resolve the commit through the GitHub API at version time, and that call fails without a token or when the API errors.

Each published package gets `CHANGELOG.md` beside `package.json` when that package is versioned. Changesets creates the file, and the version script rewrites the new section. There is no seed file and no root changelog: a seed would duplicate the heading Changesets writes, and a root index would repeat the package list.

## Release branches

`beta` publishes a snapshot and leaves the changeset in git. `production` and `release/**` consume the changeset when they version the package. After `production` publishes, squash-merge the `sync/consumed-changesets-*` pull request into `develop` before the next promotion, so the same changeset is released once. The steps are in [docs/repo-settings.md](../docs/repo-settings.md).
