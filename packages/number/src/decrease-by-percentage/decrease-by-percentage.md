# `decreaseByPercentage`

Subtracts a percentage of `value` from `value`.

## Import

```ts
import { decreaseByPercentage } from "@sgx4u/number";
```

## Signature

```ts
function decreaseByPercentage(parameters: {
    value: number;
    percent: number;
}): number | undefined;
```

## Examples

```ts
decreaseByPercentage({ value: 200, percent: 10 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `increaseByPercentage`
