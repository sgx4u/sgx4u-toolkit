---
"@sgx4u/boolean": minor
---

Summary: First release of @sgx4u/boolean, for parsing, formatting, and combining boolean values.

Added: `isBoolean` reports whether a value is a primitive boolean. Boxed booleans return `false`.

Added: `isTruthy` and `isFalsy` report JavaScript truthiness. They always return a boolean.

Added: `parseBoolean` recognizes primitive booleans, the numbers `0` and `1`, English tokens, and locale yes/no words. Unrecognized values return `undefined`, or `fallback` when one is set.

Added: `isParseableBoolean` reports whether `parseBoolean` would return a boolean for the same value, ignoring `fallback`.

Added: `getBooleanWords` returns the built-in truthy and falsy words. `listBooleanLocales` lists the supported language subtags.

Added: `formatBoolean` turns a boolean into a word for a style, locale, and capitalization.

Added: `not`, `toggle`, `all`, `any`, `none`, `nand`, `nor`, `xor`, `xnor`, `implies`, `exactlyOne`, `areEqual`, `countTrue`, and `isMajorityTrue` combine boolean values. A non-boolean entry returns `undefined`.

Added: `allPass`, `anyPass`, `nonePass`, `negate`, `exactlyOnePass`, and `impliesPass` combine predicate functions.

Added: `createBoolean` returns those functions with the caller's defaults bound in. Instances do not share mutable state.
