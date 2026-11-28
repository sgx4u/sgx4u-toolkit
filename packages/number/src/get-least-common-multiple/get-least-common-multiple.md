# `getLeastCommonMultiple`

Returns the non-negative least common multiple of two or more safe integers. The result is `undefined` when it would exceed `Number.MAX_SAFE_INTEGER`.

## Import

```ts
import { getLeastCommonMultiple } from "@sgx4u/number";
```

## Signature

```ts
function getLeastCommonMultiple(parameters: {
    values: readonly number[];
}): number | undefined;
```

## Examples

```ts
getLeastCommonMultiple({ values: [4, 6] });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `getGreatestCommonDivisor`
