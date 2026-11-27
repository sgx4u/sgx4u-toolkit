# `floorNumber`

Rounds `value` toward negative infinity at `precision` decimal places.

## Import

```ts
import { floorNumber } from "@sgx4u/number";
```

## Signature

```ts
function floorNumber(parameters: {
    value: number;
    precision?: number;
}): number | undefined;
```

## Examples

```ts
floorNumber({ value: 1.8 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `roundNumber`
- `ceilNumber`
