# Changesets

Packages version independently. On every pull request that changes a publishable package, add a changeset:

```sh
pnpm changeset
```

`baseBranch` is `develop`. `access` is `public`. `updateInternalDependencies` is `minor`, so a minor bump of a dependency also bumps the packages that depend on it.

A breaking change includes the migration steps in the changeset summary.

`beta` publishes a snapshot and leaves the changeset in git. `production` and `release/**` consume the changeset when they version the package. After `production` publishes, squash-merge the `sync/consumed-changesets-*` pull request into `develop` before the next promotion, so the same changeset is released once. The steps are in [docs/repo-settings.md](../docs/repo-settings.md).
