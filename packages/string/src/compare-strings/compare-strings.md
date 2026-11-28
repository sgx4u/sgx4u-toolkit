# `compareStrings`

Compares two strings with `Intl.Collator` and returns -1, 0, or 1. A non-string returns `undefined`, so this is not a drop-in sort comparator when inputs may be invalid.

## Import

```ts
import { compareStrings } from "@sgx4u/string";
```

## Signature

```ts
function compareStrings(options: {
    first: string;
    second: string;
    numeric?: boolean;
}): -1 | 0 | 1 | undefined;
```

## Options

| Option        | Default            | Description                                          |
| ------------- | ------------------ | ---------------------------------------------------- |
| `first`       |                    | Left-hand string. A non-string returns `undefined`.  |
| `second`      |                    | Right-hand string. A non-string returns `undefined`. |
| `locale`      | the runtime locale | Locale passed to `Intl.Collator`.                    |
| `numeric`     | `false`            | When true, digit runs compare by numeric value.      |
| `sensitivity` | `"variant"`        | `"base"`, `"accent"`, `"case"`, or `"variant"`.      |

## Examples

```ts
compareStrings({ first: "a", second: "b" });
```

## Edge cases

With `numeric: true` and locale `en-US`, `a2` sorts before `a10`. With `numeric: false`, `a2` sorts after `a10`. In `de-DE`, `ö` sorts before `z`. In `sv`, `ö` sorts after `z`. This is not a drop-in `Array#sort` comparator when an input may be invalid, because a non-string returns `undefined` rather than a number.
