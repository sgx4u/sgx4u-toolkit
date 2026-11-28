# `isMajorityTrue`

True when `true` strictly outnumbers `false`. A non-boolean entry returns `undefined`. The array is read and left unchanged. `false` for `[]` and for `[true, false]`. A non-boolean returns `undefined`, not `false`, so a bad list is not reported as "no majority".

## Import

```ts
import { isMajorityTrue } from "@sgx4u/boolean";
```

## Signature

```ts
function isMajorityTrue(values: readonly unknown[]): boolean | undefined;
```

## Examples

```ts
isMajorityTrue([]); // false
isMajorityTrue([true, false]);
```

## Edge cases

| Call                                                       | Result             |
| ---------------------------------------------------------- | ------------------ |
| `[]`                                                       | `false`            |
| An entry that is not a primitive boolean, including a hole | `undefined`        |
| `new Boolean(true)` inside the list                        | `undefined`        |
| A non-array, including `null` and an array-like object     | throws `TypeError` |
