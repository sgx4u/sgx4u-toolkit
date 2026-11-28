# `escapeRegExp`

Escapes text so it matches literally inside a regular expression. The native `RegExp.escape` is used when the runtime has it. Otherwise the ES2025 algorithm is used, including the leading digit or ASCII letter `\x` escape.

## Import

```ts
import { escapeRegExp } from "@sgx4u/string";
```

## Signature

```ts
function escapeRegExp(value: unknown): string | undefined;
```

## Examples

```ts
escapeRegExp("a.b"); // "\\x61\\.b" on a runtime with RegExp.escape
```

## Edge cases

A non-string returns `undefined`. The first character, when it is a digit or an ASCII letter, is written as `\xHH` so the result stays literal after `\0` or `\c`.
