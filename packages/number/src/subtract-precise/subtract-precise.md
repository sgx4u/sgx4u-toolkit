# `subtractPrecise`

Subtracts two decimal values. Very large magnitudes or very long fractional parts can still be unrepresentable as a number.

## Import

```ts
import { subtractPrecise } from "@sgx4u/number";
```

## Signature

```ts
function subtractPrecise(parameters: {
    first: number;
    second: number;
}): number | undefined;
```

## Examples

```ts
subtractPrecise({ first: 0.3, second: 0.1 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `sumPrecise`
- `dividePrecise`
