# `fromBase`

Parses digits in a base from 2 to 36. A safe integer is a number. A larger integer is a bigint.

## Import

```ts
import { fromBase } from "@sgx4u/number";
```

## Signature

```ts
function fromBase(parameters: {
    value: string;
    base: number;
}): number | bigint | undefined;
```

## Examples

```ts
fromBase({ value: "ff", base: 16 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `toBase`
- `parseHexadecimal`
