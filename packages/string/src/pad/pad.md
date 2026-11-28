# `pad`

Pads a string to a length in the chosen unit. The default alignment is center.

## Import

```ts
import { pad } from "@sgx4u/string";
```

## Signature

```ts
function pad(options: {
    value: string;
    maximumLength: number;
    padString?: string;
    align?: "start" | "end" | "center";
    unit?: "grapheme" | "codePoint" | "codeUnit";
}): string | undefined;
```

## Examples

```ts
pad({ value: "a", maximumLength: 3 });
```

## Edge cases

A string that is already long enough is unchanged. A negative `maximumLength` throws `RangeError`.
