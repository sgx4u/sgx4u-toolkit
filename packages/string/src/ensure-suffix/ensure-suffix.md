# `ensureSuffix`

Returns a new string with `suffix` applied once.

## Import

```ts
import { ensureSuffix } from "@sgx4u/string";
```

## Signature

```ts
function ensureSuffix(options: {
    value: string;
    suffix: string;
}): string | undefined;
```

## Options

| Option   | Default | Description                                           |
| -------- | ------- | ----------------------------------------------------- |
| `value`  |         | Text to edit. A non-string returns `undefined`.       |
| `suffix` |         | Text added when `value` does not already end with it. |

## Examples

```ts
ensureSuffix({ value: "hello", suffix: "x" });
```

## Edge cases

A non-string returns `undefined`.
