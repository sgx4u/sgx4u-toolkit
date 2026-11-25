---
"@sgx4u/eslint-config": minor
"@sgx4u/prettier-config": minor
"@sgx4u/string": minor
"@sgx4u/tsconfig": minor
"@sgx4u/tsdown-config": minor
"@sgx4u/vitest-config": minor
---

Initial public toolkit packages.

Config presets share one TypeScript, ESLint, Prettier, tsdown, and Vitest setup. `@sgx4u/string` is the first library so continuous integration can build, test, and pack a real package. These versions start at 0.1.0. Publish that first version from a laptop, because npm requires the package to exist before a trusted publisher can be attached. Later versions are published by the release workflow.
