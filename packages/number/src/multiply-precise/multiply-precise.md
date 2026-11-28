# `multiplyPrecise`

Multiplies two decimal values. Very large magnitudes or very long fractional parts can still be unrepresentable as a number.

## Import

```ts
import { multiplyPrecise } from "@sgx4u/number";
```

## Signature

```ts
function multiplyPrecise(parameters: {
    first: number;
    second: number;
}): number | undefined;
```

## Examples

```ts
multiplyPrecise({ first: 0.1, second: 0.2 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `sumPrecise`
- `dividePrecise`
