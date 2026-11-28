# `getProduct`

Returns the product of the finite numbers in an array. An empty array returns `1`.

## Import

```ts
import { getProduct } from "@sgx4u/array";
```

## Signature

```ts
function getProduct<Item>(params: GetProductParams<Item>): number | undefined;
```

## Parameters

| Name    | Description                                                                                                               |
| ------- | ------------------------------------------------------------------------------------------------------------------------- |
| `array` | Values to multiply.                                                                                                       |
| `by`    | Optional property key or function that returns the number to multiply. Omit it when the items are already finite numbers. |

## Examples

```ts
getProduct({ array: [2, 3, 4] }); // 24
getProduct({ array: [] }); // 1
getProduct({ array: [0, 5] }); // 0
```

## Edge cases

| Input                                                       | Result             |
| ----------------------------------------------------------- | ------------------ |
| `[]`                                                        | `1`                |
| `array` is not an array                                     | `undefined`        |
| An item is not a finite number and `by` is omitted          | Throws `TypeError` |
| `by` is not an iteratee, or does not return a finite number | Throws `TypeError` |

The input array is not mutated.
