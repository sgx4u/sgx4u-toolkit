---
"@sgx4u/eslint-config": minor
"@sgx4u/tsconfig": minor
---

Remove framework presets and import rules that this repository does not use.

`@sgx4u/tsconfig` no longer publishes `react.json`, `nextjs.json`, or `react-native.json`. Extend `base.json`, `library.json`, `node.json`, or `edge.json`.

`@sgx4u/eslint-config` accepts `universal`, `edge`, or `node`. It does not accept `web` or `native`, and it does not ban `react`, `react-dom`, or `react-native`.

These packages are still `0.x`. The removals are breaking for anyone who extended the deleted presets or passed `web` or `native`.
