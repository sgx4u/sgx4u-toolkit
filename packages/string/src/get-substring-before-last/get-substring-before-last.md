# `getSubstringBeforeLast`

Returns the text on one side of a separator. When the separator is missing, the result is empty or the whole string.

## Import

```ts
import { getSubstringBeforeLast } from "@sgx4u/string";
```

## Signature

```ts
function getSubstringBeforeLast(options: {
    value: string;
    separator: string;
    missing?: "empty" | "whole";
}): string | undefined;
```

## Options

| Option      | Default   | Description                                        |
| ----------- | --------- | -------------------------------------------------- |
| `value`     |           | Text to search. A non-string returns `undefined`.  |
| `separator` |           | The last match is the cut.                         |
| `missing`   | `"empty"` | `"empty"` returns `""`. `"whole"` returns `value`. |

## Examples

```ts
getSubstringBeforeLast({ value: "a-b", separator: "-" });
```

## Edge cases

`missing: "whole"` returns the original string when the separator is absent.
