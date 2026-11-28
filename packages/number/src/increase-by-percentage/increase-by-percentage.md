# `increaseByPercentage`

Adds a percentage of `value` to `value`.

## Import

```ts
import { increaseByPercentage } from "@sgx4u/number";
```

## Signature

```ts
function increaseByPercentage(parameters: {
    value: number;
    percent: number;
}): number | undefined;
```

## Examples

```ts
increaseByPercentage({ value: 200, percent: 10 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `applyPercentage`
- `decreaseByPercentage`
