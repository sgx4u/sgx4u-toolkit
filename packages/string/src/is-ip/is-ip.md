# `isIP`

Reports whether a string is an IP address. `version` is `4`, `6`, or `any`.

## Import

```ts
import { isIP } from "@sgx4u/string";
```

## Signature

```ts
function isIP(value: unknown): boolean;
```

## Examples

```ts
isIP("127.0.0.1");
```

## Edge cases

`isIPv4` and `isIPv6` are the shortcuts.
