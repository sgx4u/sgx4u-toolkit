# `getExcerpt`

Returns an end excerpt. When `breakOnWord` is true, the cut prefers the last space.

## Import

```ts
import { getExcerpt } from "@sgx4u/string";
```

## Signature

```ts
function getExcerpt(options: {
    value: string;
    maximumLength: number;
    omission?: string;
    breakOnWord?: boolean;
}): string | undefined;
```

## Examples

```ts
getExcerpt({ value: "hello world", maximumLength: 8 });
```

## Edge cases

The default omission is the ellipsis.
