# `getSign`

Returns the sign of a finite number, including `-0`. Non-finite values return `undefined`.

## Import

```ts
import { getSign } from "@sgx4u/number";
```

## Signature

```ts
function getSign(value: number): number | undefined;
```

## Examples

```ts
getSign(-4);
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `getAbsolute`
- `isNegative`
