# `randomBigInt`

Returns a bigint in the range. `includeUpper` defaults to `true`. Not cryptographically secure.

## Import

```ts
import { randomBigInt } from "@sgx4u/number";
```

## Signature

```ts
function randomBigInt(parameters: {
    lower: bigint;
    upper: bigint;
    includeUpper?: boolean;
    random?: () => number;
}): bigint;
```

## Examples

```ts
randomBigInt({ lower: 1n, upper: 3n, random: () => 0 });
```

## Edge cases

- Not cryptographically secure.

## Related

- `randomInteger`
