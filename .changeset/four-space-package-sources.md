---
"@sgx4u/eslint-config": patch
"@sgx4u/prettier-config": patch
"@sgx4u/string": patch
"@sgx4u/tsconfig": patch
"@sgx4u/tsdown-config": patch
"@sgx4u/vitest-config": patch
---

Format package sources with the repository four-space indent.

Prettier reads `.editorconfig`, which sets `indent_size` to 4. These packages were still indented with two spaces, so `pnpm format:check` failed. The text is unchanged apart from indentation and line wrapping.
