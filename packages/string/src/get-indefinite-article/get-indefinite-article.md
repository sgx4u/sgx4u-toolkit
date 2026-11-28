# `getIndefiniteArticle`

Returns `a` or `an` for English. The choice follows pronunciation, so `honour`, `8`, and `FBI` take `an`, and `unicorn` takes `a`.

## Import

```ts
import { getIndefiniteArticle } from "@sgx4u/string";
```

## Signature

```ts
function getIndefiniteArticle(value: string): "a" | "an" | undefined;
```

## Examples

```ts
getIndefiniteArticle("apple");
```

## Edge cases

An unsupported locale throws `RangeError`.
