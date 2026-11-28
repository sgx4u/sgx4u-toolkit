# `roundToIncrement`

Rounds `value` to the nearest multiple of a positive `increment`.

## Import

```ts
import { roundToIncrement } from "@sgx4u/number";
```

## Signature

```ts
function roundToIncrement(parameters: {
    value: number;
    increment: number;
    mode?: RoundingMode;
}): number | undefined;
```

## Examples

```ts
roundToIncrement({ value: 7, increment: 5 });
```

## Edge cases

- `increment` must be a positive finite number. Otherwise the result is `undefined`.

## Related

- `roundNumber`
