# `implies`

Reports material implication: `!antecedent || consequent`. Either value not being a primitive boolean returns `undefined`. The call takes one flat object.

## Import

```ts
import { implies } from "@sgx4u/boolean";
```

## Signature

```ts
function implies(input: ImpliesInput): boolean | undefined;
```

## Options

| Option       | Type      | Default  |
| ------------ | --------- | -------- |
| `antecedent` | `unknown` | required |
| `consequent` | `unknown` | required |

## Examples

```ts
implies({ antecedent: false, consequent: false }); // true
implies({ antecedent: true, consequent: false }); // false
```

## Edge cases

| Call                                        | Result                                                        |
| ------------------------------------------- | ------------------------------------------------------------- |
| `antecedent: false`, any boolean consequent | `true`                                                        |
| `antecedent: 1` or a missing consequent     | `undefined`                                                   |
| `implies(null)` or `implies(true)`          | throws `TypeError`                                            |
| `implies([])`                               | `undefined`. An array is an object and the fields are missing |
