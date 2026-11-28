# `formatSprintf`

Formats `%%`, `%s`, `%d`, `%i`, `%f`, `%j`, and numbered forms such as `%1$s`. Unknown specifiers throw `RangeError`. Nothing is evaluated.

## Import

```ts
import { formatSprintf } from "@sgx4u/string";
```

## Signature

```ts
function formatSprintf(options: {
    template: string;
    values: readonly unknown[];
}): string | undefined;
```

## Examples

```ts
formatSprintf({ template: "Hi %s", values: ["Ada"] });
```

## Edge cases

A missing argument throws `RangeError`.
