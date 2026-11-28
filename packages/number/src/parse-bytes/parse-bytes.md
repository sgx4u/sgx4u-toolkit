# `parseBytes`

Parses a byte or bit size into a count of bytes. `"1.34 kB"` is `1340` and `"1 KiB"` is `1024`. Bit units are divided by 8.

## Import

```ts
import { parseBytes } from "@sgx4u/number";
```

## Signature

```ts
function parseBytes(parameters: {
    value: string;
    standard?: "SI" | "IEC" | "auto";
}): number | undefined;
```

## Examples

```ts
parseBytes({ value: "1.34 kB" });
```

## Edge cases

- `kB` is SI. `KB` is ambiguous: `auto` uses 1024, `SI` uses 1000, and `IEC` uses 1024.
- `MiB` is always 1024-based.

## Related

- `formatBytes`
