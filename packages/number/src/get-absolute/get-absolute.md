# `getAbsolute`

Returns the absolute value of a finite number.

## Import

```ts
import { getAbsolute } from "@sgx4u/number";
```

## Signature

```ts
function getAbsolute(value: number): number | undefined;
```

## Examples

```ts
getAbsolute(-4);
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `getSign`
