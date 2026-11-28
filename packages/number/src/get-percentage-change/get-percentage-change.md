# `getPercentageChange`

Returns `100 * (to - from) / from`. A `from` of zero returns `undefined`.

## Import

```ts
import { getPercentageChange } from "@sgx4u/number";
```

## Signature

```ts
function getPercentageChange(parameters: {
    from: number;
    to: number;
}): number | undefined;
```

## Examples

```ts
getPercentageChange({ from: 50, to: 75 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `getPercentage`
