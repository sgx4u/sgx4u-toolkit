# `unquoteString`

Removes one matching quote pair and unescapes backslashes and that quote. `style` is `double`, `single`, or `backtick`. Omit `style` to accept whichever of those three wraps the text.

## Import

```ts
import { unquoteString } from "@sgx4u/string";
```

## Signature

```ts
function unquoteString(value: string): string | undefined;
function unquoteString(options: {
    value: string;
    style?: "double" | "single" | "backtick";
}): string | undefined;
```

## Examples

```ts
unquoteString('"a"');
```

## Edge cases

A string that is not wrapped is returned unchanged. A non-string returns `undefined`.
