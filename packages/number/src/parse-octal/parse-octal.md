# `parseOctal`

Parses an octal integer, with an optional `0o` prefix.

## Import

```ts
import { parseOctal } from "@sgx4u/number";
```

## Signature

```ts
function parseOctal(value: string): number | bigint | undefined;
```

## Examples

```ts
parseOctal("0o10");
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `formatOctal`
