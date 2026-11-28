# `isUUID`

Reports whether a string is a hyphenated UUID. The default version `any` accepts versions 1-8 plus nil and max.

## Import

```ts
import { isUUID } from "@sgx4u/string";
```

## Signature

```ts
function isUUID(value: unknown): boolean;
```

## Examples

```ts
isUUID("00000000-0000-0000-0000-000000000000");
```

## Edge cases

Braces are rejected. `urn:uuid:` is accepted only when `allowURN` is true. Version 9 throws `RangeError`.
