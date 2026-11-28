# `truncateNumber`

Rounds `value` toward zero at `precision` decimal places.

## Import

```ts
import { truncateNumber } from "@sgx4u/number";
```

## Signature

```ts
function truncateNumber(parameters: {
    value: number;
    precision?: number;
}): number | undefined;
```

## Examples

```ts
truncateNumber({ value: -1.8 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `roundNumber`
