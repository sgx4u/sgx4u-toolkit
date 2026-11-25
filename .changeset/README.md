# Changesets

Packages version independently. Add a changeset with `pnpm changeset` on every pull request that changes a publishable package.

`baseBranch` is `develop`, the default branch. Feature pull requests merge there. `production` is the stable release branch; do not aim changesets at a `main` branch. This repository does not have one.
