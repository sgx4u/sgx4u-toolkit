# `removePrefix`

Returns a new string with `prefix` applied once.

## Import

```ts
import { removePrefix } from "@sgx4u/string";
```

## Signature

```ts
function removePrefix(options: {
    value: string;
    prefix: string;
}): string | undefined;
```

## Options

| Option   | Default | Description                                     |
| -------- | ------- | ----------------------------------------------- |
| `value`  |         | Text to edit. A non-string returns `undefined`. |
| `prefix` |         | Removed once when `value` starts with it.       |

## Examples

```ts
removePrefix({ value: "hello", prefix: "x" });
```

## Edge cases

A non-string returns `undefined`.
