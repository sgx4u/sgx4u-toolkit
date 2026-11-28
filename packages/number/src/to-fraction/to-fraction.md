# `toFraction`

Approximates `value` with a continued fraction whose denominator is at most `maximumDenominator`.

## Import

```ts
import { toFraction } from "@sgx4u/number";
```

## Signature

```ts
function toFraction(parameters: {
    value: number;
    maximumDenominator?: number;
}): Fraction | undefined;
```

## Examples

```ts
toFraction({ value: 0.5 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `fromFraction`
