# `allPass`

Returns a predicate that is true when every predicate returns true. An empty list returns a predicate that is always `true`. Evaluation is left to right and stops on the first `false`. If a predicate throws, that exception propagates. The input list is not copied or mutated. The result is `Predicate<Value>` and does not narrow `Value`.

## Import

```ts
import { allPass } from "@sgx4u/boolean";
```

## Signature

```ts
function allPass<Value>(
    predicates: readonly Predicate<Value>[],
): Predicate<Value>;
```

## Examples

```ts
allPass([])(1); // true
```

## Edge cases

| Call                            | Result                                     |
| ------------------------------- | ------------------------------------------ |
| `[]`                            | a predicate that is always `true`          |
| A non-array                     | throws `TypeError`                         |
| An entry that is not a function | throws `TypeError` at this call, not later |
