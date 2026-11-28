# `stripImpreciseRemainder`

Replaces a floating-point artifact such as `0.30000000000000004` with the nearby short decimal. Values that are already the intended representation stay unchanged.

## Import

```ts
import { stripImpreciseRemainder } from "@sgx4u/number";
```

## Signature

```ts
function stripImpreciseRemainder(value: number): number | undefined;
```

## Examples

```ts
stripImpreciseRemainder(0.1 + 0.2);
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `addPrecise`
- `roundNumber`
