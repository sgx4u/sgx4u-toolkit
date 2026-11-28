# `parseFiniteNumber`

Parses a finite number from a number or a plain decimal string. This is the same acceptance rule as {@link parseNumber}.

## Import

```ts
import { parseFiniteNumber } from "@sgx4u/number";
```

## Signature

```ts
function parseFiniteNumber(value: unknown): number | undefined;
```

## Examples

```ts
parseFiniteNumber("8");
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `parseNumber`
- `isFiniteNumber`
