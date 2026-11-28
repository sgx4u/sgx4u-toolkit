# `padStart`

Pads a string on the left.

## Import

```ts
import { padStart } from "@sgx4u/string";
```

## Signature

```ts
function padStart(options: {
    value: string;
    maximumLength: number;
}): string | undefined;
```

## Examples

```ts
padStart({ value: "a", maximumLength: 3 });
```

## Edge cases

A string that is already long enough is unchanged.
