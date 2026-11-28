# `removeSuffix`

Returns a new string with `suffix` applied once.

## Import

```ts
import { removeSuffix } from "@sgx4u/string";
```

## Signature

```ts
function removeSuffix(options: {
    value: string;
    suffix: string;
}): string | undefined;
```

## Options

| Option   | Default | Description                                     |
| -------- | ------- | ----------------------------------------------- |
| `value`  |         | Text to edit. A non-string returns `undefined`. |
| `suffix` |         | Removed once when `value` ends with it.         |

## Examples

```ts
removeSuffix({ value: "hello", suffix: "x" });
```

## Edge cases

A non-string returns `undefined`.
