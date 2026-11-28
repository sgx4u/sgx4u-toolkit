# `convertCase`

Converts text to a named case. An unknown `case` throws `RangeError`.

## Import

```ts
import { convertCase } from "@sgx4u/string";
```

## Signature

```ts
function convertCase(options: {
    value: string;
    case: string;
}): string | undefined;
```

## Examples

```ts
convertCase({ value: "foo bar", case: "camel" });
```

## Edge cases

`case: "foo"` throws `RangeError`. A non-string `value` returns `undefined`.
