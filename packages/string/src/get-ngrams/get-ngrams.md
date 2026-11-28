# `getNgrams`

Returns overlapping slices of units. The default size is 2. A size less than 1 throws `RangeError`.

## Import

```ts
import { getNgrams } from "@sgx4u/string";
```

## Signature

```ts
function getNgrams(value: string): string[] | undefined;
```

## Examples

```ts
getNgrams("abcd");
```

## Edge cases

A size larger than the string returns an empty array.
