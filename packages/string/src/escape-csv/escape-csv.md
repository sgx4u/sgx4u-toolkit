# `escapeCSV`

Quotes a CSV field when it contains the delimiter, a quote, or a newline. Inner quotes are doubled.

## Import

```ts
import { escapeCSV } from "@sgx4u/string";
```

## Signature

```ts
function escapeCSV(value: string): string | undefined;
```

## Examples

```ts
escapeCSV("a,b");
```

## Edge cases

A plain field is returned unchanged.
