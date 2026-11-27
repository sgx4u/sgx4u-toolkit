# `isEqualWith`

Reports whether two values match by calling `valuesAreEqualWith`. Return a boolean from `comparator` to decide that pair. Return `undefined` to keep the default deep-equality rule, including `NaN` and cycles. Non-enumerable string keys are not compared.

## Import

```ts
import { isEqualWith } from "@sgx4u/object";
```

## Signature

```ts
function isEqualWith(params: IsEqualWithParams): boolean;
```

## Options

| Option            | Default | Meaning                                                    |
| ----------------- | ------- | ---------------------------------------------------------- |
| `first`, `second` |         | The values to compare.                                     |
| `comparator`      |         | `(details: EqualVisit) => boolean \| undefined`. Required. |
| `includeSymbols`  | `false` | Compare enumerable symbol keys.                            |

A `comparator` that is not a function throws `TypeError`.

## Example

```ts
isEqualWith({
    first: { a: 1 },
    second: { a: "1" },
    comparator: ({ first, second }) =>
        typeof first === "number" && typeof second === "string"
            ? first === Number(second)
            : undefined,
});
// true
```

## Edge cases

| Comparator                                       | Result                              |
| ------------------------------------------------ | ----------------------------------- |
| Returns `undefined`                              | Default deep equality for that pair |
| Returns `false` for equal numbers                | `false`                             |
| Not a function, or the argument is not an object | `TypeError`                         |
