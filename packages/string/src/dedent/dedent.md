# `dedent`

Removes the common leading indent of the non-empty lines, plus one leading newline and one trailing newline when they are present. `stripIndent` does not drop those newlines, and a first line with no indent stays as it is.

## Import

```ts
import { dedent } from "@sgx4u/string";
```

## Signature

```ts
function dedent(value: unknown): string | undefined;
```

## Examples

```ts
dedent("\n  a\n    b\n");
```

## Edge cases

A non-string returns `undefined`. Blank lines do not change the common indent.
