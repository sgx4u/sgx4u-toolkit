# `formatOctal`

Formats an integer as octal. `prefix` defaults to `true`.

## Import

```ts
import { formatOctal } from "@sgx4u/number";
```

## Signature

```ts
function formatOctal(parameters: {
    value: number | bigint;
    prefix?: boolean;
    minimumDigits?: number;
}): string | undefined;
```

## Examples

```ts
formatOctal({ value: 8 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `parseOctal`
