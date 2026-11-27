# `listBooleanLocales`

Returns the language subtags that have yes/no words, sorted, including `"en"`. Each call returns a new array. The function never throws.

## Import

```ts
import { listBooleanLocales } from "@sgx4u/boolean";
```

## Signature

```ts
function listBooleanLocales(): string[];
```

## Examples

```ts
listBooleanLocales().includes("hi"); // true
listBooleanLocales().includes("en"); // true
```

## Edge cases

| Call                        | Result                     |
| --------------------------- | -------------------------- |
| First and last entries      | `"ar"` and `"zh"`          |
| Mutating the returned array | the next call is unchanged |
