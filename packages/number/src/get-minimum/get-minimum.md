# `getMinimum`

Returns the smallest finite number in `values`. Any non-finite value, or an empty list, returns `undefined`.

## Import

```ts
import { getMinimum } from "@sgx4u/number";
```

## Signature

```ts
function getMinimum(values: readonly number[]): number | undefined;
```

## Examples

```ts
getMinimum([3, 1, 2]);
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `getMaximum`
- `getExtent`
