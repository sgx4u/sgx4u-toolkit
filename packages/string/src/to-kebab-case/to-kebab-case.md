# `toKebabCase`

Converts text to kebab case (`foo-bar`). `XMLHttpRequest` becomes words `XML`, `Http`, `Request`. `keepConsecutiveUppercase` keeps acronyms uppercase where the pattern preserves case. `mergeAmbiguousCharacters` turns `V1.2` into one alphanumeric word.

## Import

```ts
import { toKebabCase } from "@sgx4u/string";
```

## Signature

```ts
function toKebabCase(value: string): string | undefined;
function toKebabCase(options: {
    value: string;
    locale?: string | readonly string[];
    keepConsecutiveUppercase?: boolean;
    mergeAmbiguousCharacters?: boolean;
}): string | undefined;
```

## Examples

```ts
toKebabCase("foo bar");
```

## Edge cases

A non-string returns `undefined`. An empty `locale` throws `RangeError`.
