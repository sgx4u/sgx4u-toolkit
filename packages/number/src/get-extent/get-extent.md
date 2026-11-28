# `getExtent`

Returns the minimum and maximum of `values`. Any non-finite value, or an empty list, returns `undefined`.

## Import

```ts
import { getExtent } from "@sgx4u/number";
```

## Signature

```ts
function getExtent(values: readonly number[]): NumberExtent | undefined;
```

## Examples

```ts
getExtent([3, 1, 2]);
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `getMinimum`
- `getMaximum`
