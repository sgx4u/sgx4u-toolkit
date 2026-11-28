# `median`

Returns the median of a copy of `values`. The input is not mutated. An empty list or a non-finite value returns `undefined`.

## Import

```ts
import { median } from "@sgx4u/number";
```

## Signature

```ts
function median(values: readonly number[]): number | undefined;
```

## Examples

```ts
median([1, 100, 3]);
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `mean`
- `getQuartiles`
