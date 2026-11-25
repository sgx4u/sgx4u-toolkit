# Changesets

Packages version independently. Add a changeset with `pnpm changeset` on every pull request that changes a publishable package.

`baseBranch` is `develop`, the default branch. Stable feature pull requests merge there. Experimental pull requests merge into `beta`. `production` is the stable release branch; do not aim changesets at a `main` branch. This repository does not have one. A snapshot publish from `beta` does not commit the version bump and does not delete the changeset from git. The changeset is consumed when `production` or a `release/**` branch versions the package.
