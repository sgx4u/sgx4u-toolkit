# `toFilename`

Makes one safe path segment. Reserved characters and controls are replaced, trailing dots and spaces are trimmed, and Windows device names get a trailing `_`. Pass a base name, not a path.

## Import

```ts
import { toFilename } from "@sgx4u/string";
```

## Signature

```ts
function toFilename(value: string): string | undefined;
```

## Examples

```ts
toFilename("a/b?.txt");
```

## Edge cases

`CON` becomes `CON_`. An empty result becomes `_`.
