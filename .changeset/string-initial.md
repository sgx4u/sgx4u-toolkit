---
"@sgx4u/string": minor
---

Summary: First release of string helpers for blank checks and collapsed whitespace.

Added: `isBlank` reports whether a string is empty or only whitespace. Whitespace is the set `String.prototype.trim` removes, and the string is not modified.

Added: `collapseWhitespace` returns a new string with the surrounding whitespace removed and each internal whitespace run replaced by one space.

Added: `import` loads `dist/index.js` with `dist/index.d.ts`, and `require` loads `dist/index.cjs` with `dist/index.d.cts`, on Node 22.12 or newer.

Added: `@sgx4u/source` resolves `src/index.ts` when TypeScript `customConditions` includes that name. Other resolvers load `dist`.
