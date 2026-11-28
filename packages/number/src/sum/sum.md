# `sum`

Sums finite numbers with {@link sumPrecise}. An empty list is `0`.

## Import

```ts
import { sum } from "@sgx4u/number";
```

## Signature

```ts
function sum(values: readonly number[]): number | undefined;
```

## Examples

```ts
sum([1, 2, 3]);
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `sumPrecise`
- `product`
- `mean`
