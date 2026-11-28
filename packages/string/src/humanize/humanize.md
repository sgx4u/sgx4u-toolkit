# `humanize`

Turns `foo_bar` into `Foo bar`.

## Import

```ts
import { humanize } from "@sgx4u/string";
```

## Signature

```ts
function humanize(value: unknown): string | undefined;
```

## Examples

```ts
humanize("foo_bar");
```

## Edge cases

A non-string returns `undefined`.
