# `singularize`

Returns the English singular. Uncountable words stay the same. Only English is supported.

## Import

```ts
import { singularize } from "@sgx4u/string";
```

## Signature

```ts
function singularize(value: string): string | undefined;
```

## Examples

```ts
singularize("cities");
```

## Edge cases

An unsupported locale throws `RangeError`.
