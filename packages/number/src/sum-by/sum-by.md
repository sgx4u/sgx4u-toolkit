# `sumBy`

Sums the finite numbers returned by `iteratee`.

## Import

```ts
import { sumBy } from "@sgx4u/number";
```

## Signature

```ts
function sumBy<Item>(parameters: {
    values: readonly Item[];
    iteratee: (item: Item, index: number) => number;
}): number | undefined;
```

## Examples

```ts
sumBy({ values: [{ n: 1 }, { n: 2 }], iteratee: (item) => item.n });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `sum`
- `meanBy`
