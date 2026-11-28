# `toTitleCase`

Converts text to title case. APA and Chicago keep small words lowercase unless they are first or last.

## Import

```ts
import { toTitleCase } from "@sgx4u/string";
```

## Signature

```ts
function toTitleCase(value: string): string | undefined;
```

## Examples

```ts
toTitleCase("the lord of the rings");
```

## Edge cases

An unknown `style` throws `RangeError`. A caller can pass `smallWords`.
