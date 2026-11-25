# Security policy

## Supported lines

Each package keeps three lines:

| Line     | npm dist-tag | Branch                       | Receives                                                                        |
| -------- | ------------ | ---------------------------- | ------------------------------------------------------------------------------- |
| Beta     | `beta`       | `beta`                       | Snapshot prereleases of the experimental branch. It can run ahead of `develop`. |
| Latest   | `latest`     | `production`                 | Features, fixes, and security fixes promoted from `develop`                     |
| Previous | `previous`   | `release/<package>/v<major>` | Patch and minor bug fixes and security fixes. Major changes are not backported. |

`develop` is the stable integration branch. It does not publish a dist-tag. Code on `develop` is what gets promoted to `production`.

Older majors are end of life. They are deprecated on npm and do not receive fixes.

A security fix lands on `develop` first, is promoted to `production` for `latest`, is cherry-picked onto each supported `release/**` branch when it is a patch or minor fix, and is merged into `beta` so experimental builds pick it up. A major security fix is not backported. Merge `develop` into `beta` with a merge commit. That sync is how the fix reaches the `beta` dist-tag. See [docs/repo-settings.md](./docs/repo-settings.md).

## Reporting a vulnerability

Please report vulnerabilities privately.

[Open a private security advisory](https://github.com/sgx4u/sgx4u-toolkit/security/advisories/new).

Do not open a public issue, discussion, or pull request for a vulnerability. Private vulnerability reporting has to be enabled in the repository settings; until that toggle is on, contact [@sgx4u](https://github.com/sgx4u) directly and do not include exploit details in a public channel.

Fixes are prepared from the advisory's private fork and released to every supported line. You will get credit in the advisory if you want it.
