# `product`

Multiplies finite numbers. An empty list is `1`.

## Import

```ts
import { product } from "@sgx4u/number";
```

## Signature

```ts
function product(values: readonly number[]): number | undefined;
```

## Examples

```ts
product([2, 3, 4]);
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `sum`
