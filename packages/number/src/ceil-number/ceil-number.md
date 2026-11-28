# `ceilNumber`

Rounds `value` toward positive infinity at `precision` decimal places.

## Import

```ts
import { ceilNumber } from "@sgx4u/number";
```

## Signature

```ts
function ceilNumber(parameters: {
    value: number;
    precision?: number;
}): number | undefined;
```

## Examples

```ts
ceilNumber({ value: 1.2 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `roundNumber`
- `floorNumber`
