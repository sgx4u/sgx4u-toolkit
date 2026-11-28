# `equalsNormalized`

Reports whether two strings are equal after normalization. The default form is NFC.

## Import

```ts
import { equalsNormalized } from "@sgx4u/string";
```

## Signature

```ts
function equalsNormalized(options: {
    first: string;
    second: string;
    form?: "NFC" | "NFD" | "NFKC" | "NFKD";
}): boolean;
```

## Options

| Option   | Default | Description                                      |
| -------- | ------- | ------------------------------------------------ |
| `first`  |         | Left-hand string. A non-string returns `false`.  |
| `second` |         | Right-hand string. A non-string returns `false`. |
| `form`   | `"NFC"` | `"NFC"`, `"NFD"`, `"NFKC"`, or `"NFKD"`.         |

## Examples

```ts
equalsNormalized({ first: "é", second: "e\u0301" });
```

## Edge cases

A non-string returns `false`.
