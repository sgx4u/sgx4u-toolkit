# `isFalsy`

Reports whether a value is falsy under JavaScript `ToBoolean`. `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, and `NaN` return `true`. The function never throws. It does not special-case `document.all`.

## Import

```ts
import { isFalsy } from "@sgx4u/boolean";
```

## Signature

```ts
function isFalsy(value: unknown): boolean;
```

## Examples

```ts
isFalsy(0); // true
isFalsy("false"); // false
isFalsy(Number.NaN); // true
```

## Edge cases

| Value                                                      | Result  |
| ---------------------------------------------------------- | ------- |
| `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN` | `true`  |
| `true`, `1`, `"0"`, `[]`, `new Boolean(false)`             | `false` |
