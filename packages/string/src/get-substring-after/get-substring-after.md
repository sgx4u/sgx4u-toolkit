# `getSubstringAfter`

Returns the text on one side of a separator. When the separator is missing, the result is empty or the whole string.

## Import

```ts
import { getSubstringAfter } from "@sgx4u/string";
```

## Signature

```ts
function getSubstringAfter(options: {
    value: string;
    separator: string;
    missing?: "empty" | "whole";
}): string | undefined;
```

## Options

| Option      | Default   | Description                                        |
| ----------- | --------- | -------------------------------------------------- |
| `value`     |           | Text to search. A non-string returns `undefined`.  |
| `separator` |           | The first match is the cut.                        |
| `missing`   | `"empty"` | `"empty"` returns `""`. `"whole"` returns `value`. |

## Examples

```ts
getSubstringAfter({ value: "a-b", separator: "-" });
```

## Edge cases

`missing: "whole"` returns the original string when the separator is absent.
