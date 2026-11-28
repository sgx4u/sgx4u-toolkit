# `interpolateInverse`

Returns the amount that maps `start` to `end` through `value`. When all three are equal the result is `0`.

## Import

```ts
import { interpolateInverse } from "@sgx4u/number";
```

## Signature

```ts
function interpolateInverse(parameters: {
    start: number;
    end: number;
    value: number;
}): number | undefined;
```

## Examples

```ts
interpolateInverse({ start: 0, end: 10, value: 5 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `interpolateLinear`
- `normalize`
