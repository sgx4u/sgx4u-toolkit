# `uncapitalize`

Lowercases the first grapheme and leaves the rest unchanged.

## Import

```ts
import { uncapitalize } from "@sgx4u/string";
```

## Signature

```ts
function uncapitalize(value: string): string | undefined;
```

## Examples

```ts
uncapitalize("Hello");
```

## Edge cases

Turkish `I` with `locale: "tr-TR"` becomes `ı`.
