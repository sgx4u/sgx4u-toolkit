# `toConstantCase`

Converts text to constant case (`FOO_BAR`). `XMLHttpRequest` becomes words `XML`, `Http`, `Request`. `keepConsecutiveUppercase` keeps acronyms uppercase where the pattern preserves case. `mergeAmbiguousCharacters` turns `V1.2` into one alphanumeric word.

## Import

```ts
import { toConstantCase } from "@sgx4u/string";
```

## Signature

```ts
function toConstantCase(value: string): string | undefined;
function toConstantCase(options: {
    value: string;
    locale?: string | readonly string[];
    keepConsecutiveUppercase?: boolean;
    mergeAmbiguousCharacters?: boolean;
}): string | undefined;
```

## Examples

```ts
toConstantCase("foo bar");
```

## Edge cases

A non-string returns `undefined`. An empty `locale` throws `RangeError`.
