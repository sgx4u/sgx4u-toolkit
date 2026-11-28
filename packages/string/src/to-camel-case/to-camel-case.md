# `toCamelCase`

Converts text to camel case (`fooBar`). `XMLHttpRequest` becomes words `XML`, `Http`, `Request`. `keepConsecutiveUppercase` keeps acronyms uppercase where the pattern preserves case. `mergeAmbiguousCharacters` turns `V1.2` into one alphanumeric word.

## Import

```ts
import { toCamelCase } from "@sgx4u/string";
```

## Signature

```ts
function toCamelCase(value: string): string | undefined;
function toCamelCase(options: {
    value: string;
    locale?: string | readonly string[];
    keepConsecutiveUppercase?: boolean;
    mergeAmbiguousCharacters?: boolean;
}): string | undefined;
```

## Examples

```ts
toCamelCase("XMLHttpRequest"); // "xmlHttpRequest"
toCamelCase("userID"); // "userId"
toCamelCase({ value: "userID", keepConsecutiveUppercase: true }); // "userID"
toCamelCase({ value: "foo-BAR", keepConsecutiveUppercase: true }); // "fooBAR"
toCamelCase({ value: "V1.2", mergeAmbiguousCharacters: true }); // "v12"
toCamelCase({ value: "I", locale: "tr-TR" }); // "ı"
toCamelCase("__typename"); // "typename"
toCamelCase("version2Beta"); // "version2Beta"
```

## Edge cases

A non-string returns `undefined`. An empty `locale` throws `RangeError`.
