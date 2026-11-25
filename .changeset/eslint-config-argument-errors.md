---
"@sgx4u/eslint-config": patch
---

Document `definePackageConfig` and `defineRootConfig`, and throw `TypeError` for an invalid `runtime` or `rootDir`.

The messages are unchanged and still name the argument and the received value. The thrown value was `Error`. Invalid arguments are a type error, so it is now `TypeError`. `instanceof Error` still matches. The config objects the functions return are unchanged, and `rootDir` is still required.

This package is still `0.0.0` and has not been published.
