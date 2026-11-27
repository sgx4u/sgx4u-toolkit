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

- A non-finite value returns `undefined`.
- IEC byte units use kibibyte names when `Intl` has them, and `KiB` otherwise.
- IEC bit counts use the `Kibit` symbol. `Intl` has no kibibit unit, so the SI `kilobit` name is not used for a 1024 scale.

## Related

- `parseBytes`
