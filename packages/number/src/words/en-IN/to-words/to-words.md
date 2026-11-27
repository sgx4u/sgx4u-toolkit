# `toWords`

Spells a number in Indian English, thousand through shankh (below 10^19). Integers and values with at most two decimal places are supported. A fractional value is read as `point` plus each digit.

Supported range: Indian English, thousand through shankh (below 10^19).

## Import

```ts
import { toWords } from "@sgx4u/number/words/en-IN";
```

## Signature

```ts
function toWords(parameters: {
    value: number | bigint;
    kind?: "cardinal" | "ordinal";
}): string | undefined;
```

## Examples

```ts
toWords({ value: 1 });
```

## Edge cases

- A non-finite value returns `undefined`.
- More than two decimal places returns `undefined`.
- Negative cheque amounts return `undefined`.

## Related

- `toWords`
- `toOrdinalWords`
- `toCurrencyWords`
- `fromWords`
