# `toBigInt`

Converts a safe integer, an integer string, or a bigint to a bigint. Non-integers and other strings return `undefined`.

## Import

```ts
import { toBigInt } from "@sgx4u/number";
```

## Signature

```ts
function toBigInt(value: number | string | bigint): bigint | undefined;
```

## Examples

```ts
toBigInt("42");
```

## Edge cases

- An integer number outside the safe range returns `undefined`. Pass a string or a bigint for a larger value.

## Related

- `bigIntToNumber`
- `isBigInt`
