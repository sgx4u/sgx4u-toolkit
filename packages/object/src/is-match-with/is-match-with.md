# `isMatchWith`

Reports whether `object` matches `specification`, asking `comparator` at each step. Return a boolean to decide that step. Return `undefined` to use the default `isMatch` rule, including partial objects, partial arrays, and deep equality for other values.

## Import

```ts
import { isMatchWith } from "@sgx4u/object";
```

## Signature

```ts
function isMatchWith(params: IsMatchWithParams): boolean;
```

## Options

| Option          | Meaning                                                    |
| --------------- | ---------------------------------------------------------- |
| `object`        | The value being tested.                                    |
| `specification` | The required structure.                                    |
| `comparator`    | `(details: MatchVisit) => boolean \| undefined`. Required. |

`details.key` is omitted at the root. `details.path` is the path from the root. A `comparator` that is not a function throws `TypeError`.

## Example

```ts
isMatchWith({
    object: { a: 2 },
    specification: { a: 1 },
    comparator: ({ object, specification }) =>
        typeof object === "number" && typeof specification === "number"
            ? object > specification
            : undefined,
});
// true
```

## Edge cases

| Comparator                  | Result                                                        |
| --------------------------- | ------------------------------------------------------------- |
| Returns `undefined`         | Default `isMatch` rule for that step, then the walk continues |
| Returns `false` at the root | `false`, with no further walk                                 |
| Not a function              | `TypeError`                                                   |
