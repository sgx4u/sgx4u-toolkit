# `toLowerCase`

Returns the string converted with `toLocaleLowerCase`. Pass `locale: "tr-TR"` for Turkish I.

## Import

```ts
import { toLowerCase } from "@sgx4u/string";
```

## Signature

```ts
function toLowerCase(value: string): string | undefined;
```

## Examples

```ts
toLowerCase("Hello");
```

## Edge cases

A non-string returns `undefined`. An empty locale throws `RangeError`.
