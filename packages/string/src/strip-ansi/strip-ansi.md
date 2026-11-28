# `stripANSI`

Removes ANSI CSI, OSC, and similar escape sequences.

## Import

```ts
import { stripANSI } from "@sgx4u/string";
```

## Signature

```ts
function stripANSI(value: unknown): string | undefined;
```

## Examples

```ts
stripANSI("\u001b[31mred\u001b[0m");
```

## Edge cases

A non-string returns `undefined`.
