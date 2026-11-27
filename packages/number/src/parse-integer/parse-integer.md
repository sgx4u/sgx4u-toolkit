# `parseInteger`

Parses a finite integer with {@link parseNumber}. Fractions and other invalid input return `undefined`.

## Import

```ts
import { parseInteger } from "@sgx4u/number";
```

## Signature

```ts
function parseInteger(value: unknown): number | undefined;
```

## Examples

```ts
parseInteger("42");
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `parseNumber`
- `isInteger`
