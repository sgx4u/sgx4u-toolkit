# `stripBOM`

Removes one leading U+FEFF. A string without it is unchanged.

## Import

```ts
import { stripBOM } from "@sgx4u/string";
```

## Signature

```ts
function stripBOM(value: unknown): string | undefined;
```

## Examples

```ts
stripBOM("\uFEFFhello");
```

## Edge cases

Only a leading mark is removed. A non-string returns `undefined`.
