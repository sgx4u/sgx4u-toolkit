# `replaceAllOccurrences`

Replaces every match. A string pattern is literal, so `$` is not a replacement token. A regular expression is copied and the caller's `lastIndex` is restored.

## Import

```ts
import { replaceAllOccurrences } from "@sgx4u/string";
```

## Signature

```ts
function replaceAllOccurrences(options: {
    value: string;
    pattern: string | RegExp;
    replacement: string;
}): string | undefined;
```

## Options

| Option        | Default | Description                                                             |
| ------------- | ------- | ----------------------------------------------------------------------- |
| `value`       |         | Text to edit. A non-string returns `undefined`.                         |
| `pattern`     |         | A string is a literal match. A `RegExp` is copied with the global flag. |
| `replacement` |         | Literal replacement. `$` is not a token.                                |

## Examples

```ts
replaceAllOccurrences({ value: "a-a", pattern: "-", replacement: "_" });
```

## Edge cases

An empty string pattern matches nothing and returns `value` unchanged. `$` in `replacement` is literal for both a string pattern and a `RegExp`. A copied `RegExp` does not change the caller's `lastIndex`.
