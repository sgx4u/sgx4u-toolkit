# `roundNumber`

Rounds `value` to `precision` decimal places. A negative precision rounds to tens, hundreds, and so on. The mode matches `Intl.NumberFormat` and defaults to `halfExpand`.

## Import

```ts
import { roundNumber } from "@sgx4u/number";
```

## Signature

```ts
function roundNumber(parameters: {
    value: number;
    precision?: number;
    mode?: RoundingMode;
}): number | undefined;
```

## Examples

```ts
roundNumber({ value: 1.5 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `ceilNumber`
- `floorNumber`
- `truncateNumber`
