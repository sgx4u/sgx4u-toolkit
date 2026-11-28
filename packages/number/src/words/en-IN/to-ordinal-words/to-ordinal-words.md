# `toOrdinalWords`

Spells an integer as an ordinal. This is `toWords` with `kind: "ordinal"`.

Supported range: Indian English, thousand through shankh (below 10^19).

## Import

```ts
import { toOrdinalWords } from "@sgx4u/number/words/en-IN";
```

## Signature

```ts
function toOrdinalWords(parameters: {
    value: number | bigint;
}): string | undefined;
```

## Examples

```ts
toOrdinalWords({ value: 1 });
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
