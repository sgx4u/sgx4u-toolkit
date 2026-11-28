# `getInitials`

Returns the first grapheme of each word, limited to `maximumLength`. The default is 2, so `Mary Jane Watson` is `MJ`.

## Import

```ts
import { getInitials } from "@sgx4u/string";
```

## Signature

```ts
function getInitials(value: string): string | undefined;
```

## Examples

```ts
getInitials("Mary Jane Watson");
```

## Edge cases

Pass `maximumLength: 3` for `MJW`.
