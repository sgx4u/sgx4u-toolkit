# `swapCase`

Swaps the case of every cased character.

## Import

```ts
import { swapCase } from "@sgx4u/string";
```

## Signature

```ts
function swapCase(value: string): string | undefined;
```

## Examples

```ts
swapCase("Hello");
```

## Edge cases

Digits stay as they are. A non-string returns `undefined`.
