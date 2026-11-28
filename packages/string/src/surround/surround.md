# `surround`

Wraps a string. `suffix` defaults to `prefix`.

## Import

```ts
import { surround } from "@sgx4u/string";
```

## Signature

```ts
function surround(options: {
    value: string;
    prefix: string;
    suffix?: string;
}): string | undefined;
```

## Options

| Option   | Default  | Description                                     |
| -------- | -------- | ----------------------------------------------- |
| `value`  |          | Text to wrap. A non-string returns `undefined`. |
| `prefix` |          | Text placed before `value`.                     |
| `suffix` | `prefix` | Text placed after `value`.                      |

## Examples

```ts
surround({ value: "a", prefix: "*" });
```

## Edge cases

A non-string returns `undefined`.
