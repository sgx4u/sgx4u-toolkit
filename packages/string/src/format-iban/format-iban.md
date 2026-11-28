# `formatIBAN`

Groups an IBAN into fours. Use `isIBAN` when a checksum is required.

## Import

```ts
import { formatIBAN } from "@sgx4u/string";
```

## Signature

```ts
function formatIBAN(value: unknown): string | undefined;
```

## Examples

```ts
formatIBAN("GB82WEST12345698765432");
```

## Edge cases

Spaces already in the input are removed first.
