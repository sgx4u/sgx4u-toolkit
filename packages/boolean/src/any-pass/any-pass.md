# `anyPass`

Returns a predicate that is true when any predicate returns true. An empty list returns a predicate that is always `false`. Evaluation is left to right and stops on the first `true`. If a predicate throws, that exception propagates. The input list is not copied or mutated. The result is `Predicate<Value>` and does not narrow `Value`.

## Import

```ts
import { anyPass } from "@sgx4u/boolean";
```

## Signature

```ts
function anyPass<Value>(
    predicates: readonly Predicate<Value>[],
): Predicate<Value>;
```

## Examples

```ts
anyPass([])(1); // false
```

## Edge cases

| Call                            | Result                                     |
| ------------------------------- | ------------------------------------------ |
| `[]`                            | a predicate that is always `false`         |
| A non-array                     | throws `TypeError`                         |
| An entry that is not a function | throws `TypeError` at this call, not later |
