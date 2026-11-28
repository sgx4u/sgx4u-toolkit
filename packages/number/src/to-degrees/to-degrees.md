# `toDegrees`

Converts radians to degrees. A non-finite value returns `undefined`.

## Import

```ts
import { toDegrees } from "@sgx4u/number";
```

## Signature

```ts
function toDegrees(radians: number): number | undefined;
```

## Examples

```ts
toDegrees(Math.PI);
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `toRadians`
