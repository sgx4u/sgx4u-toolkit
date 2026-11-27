# `toSignificantDigits`

Rounds `value` to `digits` significant digits.

## Import

```ts
import { toSignificantDigits } from "@sgx4u/number";
```

## Signature

```ts
function toSignificantDigits(parameters: {
    value: number;
    digits: number;
    mode?: RoundingMode;
}): number | undefined;
```

## Examples

```ts
toSignificantDigits({ value: 12345, digits: 2 });
```

## Edge cases

- A non-finite value returns `undefined`.
- `digits` must be a positive integer. Any other `digits` throws `RangeError`.
- More than 17 significant digits cannot change a double, so the finite value is returned unchanged.
- A tiny magnitude such as `1e-320` is rounded without throwing.

## Related

- `roundNumber`
