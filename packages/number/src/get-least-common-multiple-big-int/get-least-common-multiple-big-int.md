# `getLeastCommonMultipleBigInt`

Returns the non-negative least common multiple of two or more bigints.

## Import

```ts
import { getLeastCommonMultipleBigInt } from "@sgx4u/number";
```

## Signature

```ts
function getLeastCommonMultipleBigInt(parameters: {
    values: readonly bigint[];
}): bigint | undefined;
```

## Examples

```ts
getLeastCommonMultipleBigInt({ values: [4n, 6n] });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `getLeastCommonMultiple`
