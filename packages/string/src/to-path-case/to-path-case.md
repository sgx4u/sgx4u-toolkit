# `toPathCase`

Converts text to path case (`foo/bar`). `XMLHttpRequest` becomes words `XML`, `Http`, `Request`. `keepConsecutiveUppercase` keeps acronyms uppercase where the pattern preserves case. `mergeAmbiguousCharacters` turns `V1.2` into one alphanumeric word.

## Import

```ts
import { toPathCase } from "@sgx4u/string";
```

## Signature

```ts
function toPathCase(value: string): string | undefined;
function toPathCase(options: {
    value: string;
    locale?: string | readonly string[];
    keepConsecutiveUppercase?: boolean;
    mergeAmbiguousCharacters?: boolean;
}): string | undefined;
```

## Examples

```ts
toPathCase("foo bar");
```

## Edge cases

A non-string returns `undefined`. An empty `locale` throws `RangeError`.
