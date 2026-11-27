---
"@sgx4u/number": minor
---

Summary: First release of @sgx4u/number, a zero-dependency library for checks, parsing, rounding, formatting, precise decimal arithmetic, statistics, random values, bases, Roman numerals, and BigInt helpers.

Added: `isFiniteNumber`, `parseNumber`, and `parseLocaleNumber` tell a real number from text. Grouped numbers such as `12,34,567.89` and `1.234,56` parse with a locale. `"25%"` parses as the ratio `0.25`.

Added: `addPrecise` makes `0.1 + 0.2` equal `0.3`. `sum` returns the correctly rounded sum of the exact values, and an empty sum is `0`.

Added: `roundNumber` rounds with the same mode names as `Intl.NumberFormat`. The default is `halfExpand`. `formatNumber`, `formatCurrency`, and `formatBytes` format finite numbers and return `undefined` for `NaN` and infinities.

Added: `createNumber` binds locale, currency, rounding, and the other defaults for one frozen set of helpers. A later call can override any of them. Two instances stay independent.

Added: `@sgx4u/number/words/en` and `@sgx4u/number/words/en-IN` spell and parse numbers, including Indian lakh and crore and an optional cheque style. The root import does not download those word lists.
