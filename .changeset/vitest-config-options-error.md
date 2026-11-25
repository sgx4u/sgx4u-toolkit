---
"@sgx4u/vitest-config": patch
---

Document `definePackageVitestConfig`, and name the rejected `options` value on the `TypeError`.

A function, promise, array, or `null` still throws. The error was `Error` and did not include the received value. It is now `TypeError`, and the message names `options` and the received value. The Node environment and the `src` test include are unchanged. A caller's `test` object still replaces one field at a time.

`definePackageVitestConfig` now lives in its own folder. `src/index.ts` only re-exports it. The export map adds `@sgx4u/source` on the same terms as `@sgx4u/tsdown-config`.

This package is still `0.0.0` and has not been published.
