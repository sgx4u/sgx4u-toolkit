# Security policy

## Supported lines

Each package keeps three lines:

| Line     | npm dist-tag | Branch                       | Receives                                   |
| -------- | ------------ | ---------------------------- | ------------------------------------------ |
| Beta     | `beta`       | `next`                       | The next major, including breaking changes |
| Latest   | `latest`     | `main`                       | Features, fixes, and security fixes        |
| Previous | `previous`   | `release/<package>/v<major>` | Bug fixes and security fixes               |

Older majors are end of life. They are deprecated on npm and do not receive fixes.

A security fix is applied to latest, previous, and beta. Beta receives it immediately or through the weekly merge from `main`.

## Reporting a vulnerability

Please report vulnerabilities privately.

[Open a private security advisory](https://github.com/sgx4u/sgx4u-toolkit/security/advisories/new).

Do not open a public issue, discussion, or pull request for a vulnerability. Private vulnerability reporting has to be enabled in the repository settings; until that toggle is on, contact [@sgx4u](https://github.com/sgx4u) directly and do not include exploit details in a public channel.

Fixes are prepared from the advisory's private fork and released to every supported line. You will get credit in the advisory if you want it.
