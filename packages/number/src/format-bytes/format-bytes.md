# `formatBytes`

Formats a byte count, or a bit count when `bits` is true. SI steps by 1000 and IEC by 1024. A unit the runtime cannot name falls back to an English symbol such as `KiB`.

## Import

```ts
import { formatBytes } from "@sgx4u/number";
```

## Signature

```ts
function formatBytes(parameters: {
    value: number;
    locale?: string | readonly string[];
    standard?: ByteStandard;
    bits?: boolean;
    signed?: boolean;
    maximumFractionDigits?: number;
}): string | undefined;
```

## Examples

```ts
formatBytes({ value: 1340 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `parseBytes`
