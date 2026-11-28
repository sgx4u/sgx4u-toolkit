# `formatBinary`

Formats an integer as binary. `prefix` defaults to `true`.

## Import

```ts
import { formatBinary } from "@sgx4u/number";
```

## Signature

```ts
function formatBinary(parameters: {
    value: number | bigint;
    prefix?: boolean;
    minimumDigits?: number;
}): string | undefined;
```

## Examples

```ts
formatBinary({ value: 5 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `parseBinary`
- `toBase`
