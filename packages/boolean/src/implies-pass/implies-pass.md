# `impliesPass`

Returns a predicate for `!antecedent(value) || consequent(value)`. `consequent` is not called when `antecedent` returns `false`. If either predicate throws, that exception propagates. The call takes one flat object.

## Import

```ts
import { impliesPass } from "@sgx4u/boolean";
```

## Signature

```ts
function impliesPass<Value>(input: ImpliesPassInput<Value>): Predicate<Value>;
```

## Options

| Option       | Type               | Default  |
| ------------ | ------------------ | -------- |
| `antecedent` | `Predicate<Value>` | required |
| `consequent` | `Predicate<Value>` | required |

## Examples

```ts
impliesPass({
    antecedent: (value: number) => value > 0,
    consequent: (value: number) => value < 10,
})(4); // true
```

## Edge cases

| Call                              | Result                                            |
| --------------------------------- | ------------------------------------------------- |
| `antecedent` returns `false`      | `true`, and `consequent` is not called            |
| `impliesPass(null)`               | throws `TypeError`                                |
| Either property is not a function | throws `TypeError`                                |
| `impliesPass([])`                 | throws `TypeError` because the fields are missing |
