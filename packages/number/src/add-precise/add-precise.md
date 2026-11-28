# `addPrecise`

Adds two decimal values so that `0.1 + 0.2` is `0.3`. Very large magnitudes or very long fractional parts can still be unrepresentable as a number.

## Import

```ts
import { addPrecise } from "@sgx4u/number";
```

## Signature

```ts
function addPrecise(parameters: {
    first: number;
    second: number;
}): number | undefined;
```

## Examples

```ts
addPrecise({ first: 0.1, second: 0.2 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `sumPrecise`
- `dividePrecise`
