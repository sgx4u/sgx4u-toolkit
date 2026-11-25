---
"@sgx4u/eslint-config": minor
---

Require `rootDir` and set `parserOptions.tsconfigRootDir` from it.

`definePackageConfig({ runtime, rootDir })` and `defineRootConfig({ rootDir })` now require the directory of the ESLint config file. Pass `import.meta.dirname`. typescript-eslint records that directory whenever `tseslint.configs` is read. The editor loads several configs in one process, then the parser finds more than one directory and reports a parsing error on every file. Setting `tsconfigRootDir` skips that guess.

This package is still `0.0.0` and has not been published. The new option is required, so this is a minor change.
