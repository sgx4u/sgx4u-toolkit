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

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `roundNumber`
