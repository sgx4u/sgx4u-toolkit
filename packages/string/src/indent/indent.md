# `indent`

Prefixes every non-empty line. `count` is how many times `character` is repeated. The default is one space.

## Import

```ts
import { indent } from "@sgx4u/string";
```

## Signature

```ts
function indent(options: {
    value: string;
    count?: number;
    character?: string;
}): string | undefined;
```

## Examples

```ts
indent({ value: "a\nb" });
```

## Edge cases

A negative `count` throws `RangeError`. Empty lines stay empty.
