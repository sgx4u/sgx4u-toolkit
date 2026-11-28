# `compareNumbers`

Compares two numbers. Returns `-1`, `0`, or `1`. `NaN` and non-numbers return `undefined`. `-0` and `0` compare equal.

## Import

```ts
import { compareNumbers } from "@sgx4u/number";
```

## Signature

```ts
function compareNumbers(parameters: {
    first: number;
    second: number;
}): -1 | 0 | 1 | undefined;
```

## Examples

```ts
compareNumbers({ first: 1, second: 2 });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `getMinimum`
- `getMaximum`
