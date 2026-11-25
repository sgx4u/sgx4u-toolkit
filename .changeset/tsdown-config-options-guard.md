---
"@sgx4u/tsdown-config": patch
---

Document `defineLibraryConfig`, reject a non-object `options`, and resolve TypeScript to the source.

A function, promise, array, or `null` used to be spread into nothing, so the caller's overrides were dropped and the preset was returned. Those values now throw `TypeError`. The message names `options` and the received value. A plain object still replaces preset fields one at a time, and `fixedExtension` stays false unless the caller sets it.

`defineLibraryConfig` now lives in its own folder. `src/index.ts` only re-exports it. The export map adds `@sgx4u/source`, pointing at `src/index.ts`, before the `import` and `require` conditions. TypeScript uses that condition only when `customConditions` includes `@sgx4u/source`, which the shared tsconfig already sets. Other resolvers ignore it and still load `dist`.

This package is still `0.0.0` and has not been published. The thrown error fixes values the type already rejected, so this is a patch.
