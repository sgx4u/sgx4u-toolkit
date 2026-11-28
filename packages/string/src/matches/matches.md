# `matches`

Reports whether a string contains a literal or matches a regular expression. A non-string returns `false` and does not throw.

## Import

```ts
import { matches } from "@sgx4u/string";
```

## Signature

```ts
function matches(options: { value: string; pattern: string | RegExp }): boolean;
```

## Options

| Option    | Default | Description                                                                               |
| --------- | ------- | ----------------------------------------------------------------------------------------- |
| `value`   |         | Text to test. A non-string returns `false` and does not throw.                            |
| `pattern` |         | A string is a literal substring. A `RegExp` is tested on a copy so `lastIndex` stays put. |

## Examples

```ts
matches({ value: "hello", pattern: "ell" });
```

## Edge cases

The caller's `RegExp` `lastIndex` is restored.
