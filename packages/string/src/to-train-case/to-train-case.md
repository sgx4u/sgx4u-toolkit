# `toTrainCase`

Converts text to train case (`Foo-Bar`), the HTTP header form. `XMLHttpRequest` becomes words `XML`, `Http`, `Request`. `keepConsecutiveUppercase` keeps acronyms uppercase where the pattern preserves case. `mergeAmbiguousCharacters` turns `V1.2` into one alphanumeric word.

## Import

```ts
import { toTrainCase } from "@sgx4u/string";
```

## Signature

```ts
function toTrainCase(value: string): string | undefined;
function toTrainCase(options: {
    value: string;
    locale?: string | readonly string[];
    keepConsecutiveUppercase?: boolean;
    mergeAmbiguousCharacters?: boolean;
}): string | undefined;
```

## Examples

```ts
toTrainCase("foo bar");
```

## Edge cases

A non-string returns `undefined`. An empty `locale` throws `RangeError`.
