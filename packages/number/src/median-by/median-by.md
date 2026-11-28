# `medianBy`

Returns the median of the numbers returned by `iteratee`.

## Import

```ts
import { medianBy } from "@sgx4u/number";
```

## Signature

```ts
function medianBy<Item>(parameters: {
    values: readonly Item[];
    iteratee: (item: Item, index: number) => number;
}): number | undefined;
```

## Examples

```ts
medianBy({ values: [3, 1, 2], iteratee: (item) => item });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `median`
- `meanBy`
