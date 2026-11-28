# `toUpperCase`

Returns the string converted with `toLocaleUpperCase`. Pass `locale: "tr-TR"` for Turkish I.

## Import

```ts
import { toUpperCase } from "@sgx4u/string";
```

## Signature

```ts
function toUpperCase(value: string): string | undefined;
```

## Examples

```ts
toUpperCase("Hello");
```

## Edge cases

A non-string returns `undefined`. An empty locale throws `RangeError`.
