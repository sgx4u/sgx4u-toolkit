# `isBlank`

Reports whether `value` is empty or contains only Unicode whitespace.

## Import

```ts
import { isBlank } from "@sgx4u/string";
```

## Signature

```ts
function isBlank(value: unknown): boolean;
```

## Examples

```ts
isBlank("  ");
```

## Edge cases

A non-breaking space is blank. A letter is not.
