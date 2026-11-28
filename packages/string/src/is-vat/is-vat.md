# `isVAT`

Reports whether a string matches an EU or UK VAT pattern. Belgium, the 9-digit UK form, and the Netherlands also use a checksum. The other countries are pattern checks. Omit `country` to infer it from the leading letters.

## Import

```ts
import { isVAT } from "@sgx4u/string/validators/locale";
```

## Signature

```ts
function isVAT(value: string): boolean;
```

## Examples

```ts
isVAT("DE123456789");
```

## Edge cases

An unknown explicit country throws `RangeError`. A prefix that is not a known VAT country returns `false`.
