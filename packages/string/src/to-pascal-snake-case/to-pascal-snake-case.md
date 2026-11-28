# `toPascalSnakeCase`

Converts text to pascal snake case (`Foo_Bar`). `XMLHttpRequest` becomes words `XML`, `Http`, `Request`. `keepConsecutiveUppercase` keeps acronyms uppercase where the pattern preserves case. `mergeAmbiguousCharacters` turns `V1.2` into one alphanumeric word.

## Import

```ts
import { toPascalSnakeCase } from "@sgx4u/string";
```

## Signature

```ts
function toPascalSnakeCase(value: string): string | undefined;
function toPascalSnakeCase(options: {
    value: string;
    locale?: string | readonly string[];
    keepConsecutiveUppercase?: boolean;
    mergeAmbiguousCharacters?: boolean;
}): string | undefined;
```

## Examples

```ts
toPascalSnakeCase("foo bar");
```

## Edge cases

A non-string returns `undefined`. An empty `locale` throws `RangeError`.
