# `listPostalCodeCountries`

Returns the sorted ISO country codes that `isPostalCode` accepts.

## Import

```ts
import { listPostalCodeCountries } from "@sgx4u/string/validators/locale";
```

## Signature

```ts
function listPostalCodeCountries(): string[];
```

## Examples

```ts
listPostalCodeCountries().includes("IN");
```

## Edge cases

The list is a new array on every call.
