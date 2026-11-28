# `getPercentage`

Returns `100 * part / whole`, so a quarter of a whole is `25`. A whole of zero returns `undefined`.

## Import

```ts
import { getPercentage } from "@sgx4u/number";
```

## Signature

```ts
function getPercentage(parameters: {
    part: number;
    whole: number;
}): number | undefined;
```

## Examples

```ts
getPercentage({ part: 1, whole: 4 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `getPercentageChange`
- `applyPercentage`
