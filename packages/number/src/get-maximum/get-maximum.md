# `getMaximum`

Returns the largest finite number in `values`. Any non-finite value, or an empty list, returns `undefined`.

## Import

```ts
import { getMaximum } from "@sgx4u/number";
```

## Signature

```ts
function getMaximum(values: readonly number[]): number | undefined;
```

## Examples

```ts
getMaximum([3, 1, 2]);
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `getMinimum`
- `getExtent`
