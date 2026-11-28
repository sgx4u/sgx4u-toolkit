# `formatHexadecimal`

Formats an integer as hexadecimal. `prefix` defaults to `true` and `uppercase` defaults to `false`.

## Import

```ts
import { formatHexadecimal } from "@sgx4u/number";
```

## Signature

```ts
function formatHexadecimal(parameters: {
    value: number | bigint;
    prefix?: boolean;
    minimumDigits?: number;
    uppercase?: boolean;
}): string | undefined;
```

## Examples

```ts
formatHexadecimal({ value: 255 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `parseHexadecimal`
