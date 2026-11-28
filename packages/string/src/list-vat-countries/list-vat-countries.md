# `listVATCountries`

Returns the sorted country codes that `isVAT` accepts.

## Import

```ts
import { listVATCountries } from "@sgx4u/string/validators/locale";
```

## Signature

```ts
function listVATCountries(): string[];
```

## Examples

```ts
listVATCountries().includes("DE");
```

## Edge cases

The list is a new array on every call.
