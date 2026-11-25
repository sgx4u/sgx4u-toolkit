# Changesets

Packages version independently. Add a changeset with `pnpm changeset` on every pull request that changes a publishable package.

`baseBranch` is `main`. This repository was created on `develop`; rename that branch to `main` before relying on `pnpm changeset status` without an explicit `--since`.
