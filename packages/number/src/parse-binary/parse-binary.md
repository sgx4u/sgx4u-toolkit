# `parseBinary`

Parses a binary integer, with an optional `0b` prefix.

## Import

```ts
import { parseBinary } from "@sgx4u/number";
```

## Signature

```ts
function parseBinary(value: string): number | bigint | undefined;
```

## Examples

```ts
parseBinary("0b1010");
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `formatBinary`
