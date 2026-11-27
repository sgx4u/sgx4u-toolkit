# `parseNumber`

Parses a finite number or a plain decimal string. Grouping separators, currency, and the words `NaN` and `Infinity` return `undefined`. See {@link parseLocaleNumber} for grouped text.

## Import

```ts
import { parseNumber } from "@sgx4u/number";
```

## Signature

```ts
function parseNumber(value: unknown): number | undefined;
```

## Examples

```ts
parseNumber("1e-3");
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `parseLocaleNumber`
- `parseInteger`
- `parseFiniteNumber`
