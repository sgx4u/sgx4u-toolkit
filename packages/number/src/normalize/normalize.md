# `normalize`

Maps `value` from `[start, end]` onto `[0, 1]`. A zero-length source returns `0` only when `value` is exactly `start`.

## Import

```ts
import { normalize } from "@sgx4u/number";
```

## Signature

```ts
function normalize(parameters: {
    value: number;
    start: number;
    end: number;
}): number | undefined;
```

## Examples

```ts
normalize({ value: 5, start: 0, end: 10 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `remapRange`
