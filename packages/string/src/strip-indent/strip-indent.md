# `stripIndent`

Removes the common indent. A first line with no indent stays as it is, and leading or trailing newlines are kept. `dedent` also drops one leading and one trailing newline.

## Import

```ts
import { stripIndent } from "@sgx4u/string";
```

## Signature

```ts
function stripIndent(value: unknown): string | undefined;
```

## Examples

```ts
stripIndent("a\n  b");
```

## Edge cases

A non-string returns `undefined`.
