# `hasHalfWidthCharacter`

Reports whether a string contains a halfwidth character such as halfwidth katakana.

## Import

```ts
import { hasHalfWidthCharacter } from "@sgx4u/string";
```

## Signature

```ts
function hasHalfWidthCharacter(value: unknown): boolean;
```

## Examples

```ts
hasHalfWidthCharacter("ｱ");
```

## Edge cases

ASCII and fullwidth hiragana return `false`.
