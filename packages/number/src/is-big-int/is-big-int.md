# `isBigInt`

Reports whether `value` is a bigint.

## Import

```ts
import { isBigInt } from "@sgx4u/number";
```

## Signature

```ts
function isBigInt(value: unknown): value is bigint;
```

## Examples

```ts
isBigInt(1n);
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `toBigInt`
- `isNumber`
