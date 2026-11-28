# `toRadians`

Converts degrees to radians. A non-finite value returns `undefined`.

## Import

```ts
import { toRadians } from "@sgx4u/number";
```

## Signature

```ts
function toRadians(degrees: number): number | undefined;
```

## Examples

```ts
toRadians(180);
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `toDegrees`
