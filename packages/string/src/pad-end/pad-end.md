# `padEnd`

Pads a string on the right.

## Import

```ts
import { padEnd } from "@sgx4u/string";
```

## Signature

```ts
function padEnd(options: {
    value: string;
    maximumLength: number;
}): string | undefined;
```

## Examples

```ts
padEnd({ value: "a", maximumLength: 3 });
```

## Edge cases

A string that is already long enough is unchanged.
