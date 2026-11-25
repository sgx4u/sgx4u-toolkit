# Security policy

## Supported lines

| Line     | npm dist-tag | Branch                       | Receives                                                                     |
| -------- | ------------ | ---------------------------- | ---------------------------------------------------------------------------- |
| Beta     | `beta`       | `beta`                       | Snapshot releases of the experimental branch. It can run ahead of `develop`. |
| Latest   | `latest`     | `production`                 | Features, fixes, and security fixes promoted from `develop`.                 |
| Previous | `previous`   | `release/<package>/v<major>` | Patch and minor bug fixes and security fixes.                                |

`develop` is the stable integration branch. Promoting it to `production` is what ships `latest`.

Older majors are deprecated on npm.

## Releasing a fix

1. Land the fix on `develop` through a pull request.
2. Promote `develop` to `production` so `latest` publishes it.
3. Cherry-pick a patch or minor fix onto each supported `release/**` branch.
4. Merge `develop` into `beta` with a merge commit so the `beta` dist-tag publishes the fix. Commands are in [Keeping beta in sync](./README.md#keeping-beta-in-sync).

A breaking security fix ships on `develop` and `production`. `release/**` takes patch and minor fixes.

## Reporting a vulnerability

Report a vulnerability through GitHub's private vulnerability reporting: [Security tab > Report a vulnerability](https://github.com/sgx4u/sgx4u-toolkit/security/advisories/new). Keep exploit details off public channels.

Prepare the fix from the advisory's private fork and release it to every supported line. You will get credit in the advisory if you want it.
