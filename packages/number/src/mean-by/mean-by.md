# `meanBy`

Returns the mean of the numbers returned by `iteratee`.

## Import

```ts
import { meanBy } from "@sgx4u/number";
```

## Signature

```ts
function meanBy<Item>(parameters: {
    values: readonly Item[];
    iteratee: (item: Item, index: number) => number;
}): number | undefined;
```

## Examples

```ts
meanBy({ values: [1, 3], iteratee: (item) => item });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `mean`
- `sumBy`
