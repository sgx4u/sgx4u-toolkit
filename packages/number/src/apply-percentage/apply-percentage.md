# `applyPercentage`

Returns `value * (percent / 100)`.

## Import

```ts
import { applyPercentage } from "@sgx4u/number";
```

## Signature

```ts
function applyPercentage(parameters: {
    value: number;
    percent: number;
}): number | undefined;
```

## Examples

```ts
applyPercentage({ value: 200, percent: 10 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `increaseByPercentage`
- `decreaseByPercentage`
