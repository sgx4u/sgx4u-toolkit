# `getSubstringBetween`

Returns the text between the first start marker and the next end marker.

## Import

```ts
import { getSubstringBetween } from "@sgx4u/string";
```

## Signature

```ts
function getSubstringBetween(options: {
    value: string;
    start: string;
    end: string;
    missing?: "empty" | "whole";
}): string | undefined;
```

## Options

| Option    | Default   | Description                                          |
| --------- | --------- | ---------------------------------------------------- |
| `value`   |           | Text to search. A non-string returns `undefined`.    |
| `start`   |           | The first occurrence opens the range.                |
| `end`     |           | The first occurrence after `start` closes the range. |
| `missing` | `"empty"` | Used when either marker is absent.                   |

## Examples

```ts
getSubstringBetween({ value: "a[b]c", start: "[", end: "]" });
```

## Edge cases

A missing marker returns `""` or the whole string.
