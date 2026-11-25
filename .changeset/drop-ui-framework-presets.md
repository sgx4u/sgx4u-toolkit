---
"@sgx4u/eslint-config": minor
"@sgx4u/tsconfig": minor
---

Remove framework presets and import rules that this repository does not use.

`@sgx4u/tsconfig` no longer publishes `react.json`, `nextjs.json`, or `react-native.json`. Extend `base.json`, `library.json`, `node.json`, or `workers.json`.

`@sgx4u/eslint-config` accepts `universal`, `edge`, or `node`. It no longer accepts `web` or `native`, and it no longer bans `react`, `react-dom`, or `react-native`. Imports from `@sgx4u-private` stay rejected.

These packages are still `0.x`. The removals are breaking for anyone who extended the deleted presets or passed `web` or `native`.
