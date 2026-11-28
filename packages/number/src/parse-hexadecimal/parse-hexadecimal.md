# `parseHexadecimal`

Parses a hexadecimal integer, with an optional `0x` prefix.

## Import

```ts
import { parseHexadecimal } from "@sgx4u/number";
```

## Signature

```ts
function parseHexadecimal(value: string): number | bigint | undefined;
```

## Examples

```ts
parseHexadecimal("0xff");
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `formatHexadecimal`
