# `toBase`

Converts an integer to digits in a base from 2 to 36. A bigint keeps full precision. A number outside the safe integer range returns `undefined`.

## Import

```ts
import { toBase } from "@sgx4u/number";
```

## Signature

```ts
function toBase(parameters: {
    value: number | bigint;
    base: number;
    prefix?: boolean;
    minimumDigits?: number;
}): string | undefined;
```

## Examples

```ts
toBase({ value: 255, base: 16, prefix: true });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `fromBase`
- `formatHexadecimal`
