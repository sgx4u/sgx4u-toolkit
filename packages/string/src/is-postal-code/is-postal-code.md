# `isPostalCode`

Reports whether a string matches a compact postal pattern for an ISO country code. Unknown countries throw `RangeError`.

## Import

```ts
import { isPostalCode } from "@sgx4u/string/validators/locale";
```

## Signature

```ts
function isPostalCode(options: { value: string; country: string }): boolean;
```

## Examples

```ts
isPostalCode({ value: "560001", country: "IN" }); // true
```

## Edge cases

The patterns are practical shapes, not a complete official database.
