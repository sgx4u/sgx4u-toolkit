# `sumPrecise`

Returns the correctly rounded sum of the exact double values. An empty list is `0`, unlike `Math.sumPrecise`, which returns `-0`. When `Math.sumPrecise` exists it is used for a non-empty list.

## Import

```ts
import { sumPrecise } from "@sgx4u/number";
```

## Signature

```ts
function sumPrecise(values: readonly number[]): number | undefined;
```

## Examples

```ts
sumPrecise([1e20, 0.1, -1e20]);
```

## Edge cases

- `sumPrecise([0.1, 0.2])` is the IEEE sum, not the decimal `0.3`. Use `addPrecise` for decimal addition.
- An empty list returns `0`.

## Related

- `sum`
- `addPrecise`
