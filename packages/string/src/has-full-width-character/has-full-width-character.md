# `hasFullWidthCharacter`

Reports whether a string contains a wide, fullwidth, or emoji grapheme.

## Import

```ts
import { hasFullWidthCharacter } from "@sgx4u/string";
```

## Signature

```ts
function hasFullWidthCharacter(value: unknown): boolean;
```

## Examples

```ts
hasFullWidthCharacter("あ");
```

## Edge cases

ASCII text returns `false`. A non-string returns `false`.
