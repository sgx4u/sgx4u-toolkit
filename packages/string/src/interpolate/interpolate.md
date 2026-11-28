# `interpolate`

Replaces `{name}` or `{{name}}` placeholders. Values are stringified with `String`. Nothing is evaluated.

## Import

```ts
import { interpolate } from "@sgx4u/string";
```

## Signature

```ts
function interpolate(options: {
    template: string;
    values: Record<string, unknown>;
    pattern?: "curly" | "double-curly";
    missing?: "empty" | "keep";
}): string | undefined;
```

## Examples

```ts
interpolate({ template: "Hi {name}", values: { name: "Ada" } });
```

## Edge cases

A missing key becomes an empty string, or stays as the placeholder when `missing` is `keep`.
