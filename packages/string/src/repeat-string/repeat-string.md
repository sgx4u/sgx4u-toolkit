# `repeatString`

Repeats a string. A count of 0 returns an empty string. A negative or fractional count throws `RangeError`.

## Import

```ts
import { repeatString } from "@sgx4u/string";
```

## Signature

```ts
function repeatString(options: {
    value: string;
    count: number;
}): string | undefined;
```

## Options

| Option  | Default | Description                                                                |
| ------- | ------- | -------------------------------------------------------------------------- |
| `value` |         | Text to repeat. A non-string returns `undefined` after `count` is checked. |
| `count` |         | How many copies. `0` returns `""`.                                         |

## Examples

```ts
repeatString({ value: "ab", count: 2 });
```

## Edge cases

A non-string `value` returns `undefined` after `count` is checked.
