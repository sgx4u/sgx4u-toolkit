# `ensurePrefix`

Returns a new string with `prefix` applied once.

## Import

```ts
import { ensurePrefix } from "@sgx4u/string";
```

## Signature

```ts
function ensurePrefix(options: {
    value: string;
    prefix: string;
}): string | undefined;
```

## Options

| Option   | Default | Description                                             |
| -------- | ------- | ------------------------------------------------------- |
| `value`  |         | Text to edit. A non-string returns `undefined`.         |
| `prefix` |         | Text added when `value` does not already start with it. |

## Examples

```ts
ensurePrefix({ value: "hello", prefix: "x" });
```

## Edge cases

A non-string returns `undefined`.
