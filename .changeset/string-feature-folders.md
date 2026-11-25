---
"@sgx4u/string": patch
---

Document `isBlank` and `collapseWhitespace`, and move each function into its own folder.

The public functions are unchanged. `src/index.ts` only re-exports them. Each function lives in `src/<name>/<name>.ts` with a folder `index.ts`, and the test sits beside the function. Whitespace is the set `String.prototype.trim` removes. Neither function modifies its argument.

This package is still `0.0.0` and has not been published. The change is comments and file layout, so this is a patch.
