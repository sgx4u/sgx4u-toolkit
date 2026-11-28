# `negate`

Returns a predicate that inverts `predicate`. The original function is not mutated. If `predicate` throws, that exception propagates.

## Import

```ts
import { negate } from "@sgx4u/boolean";
```

## Signature

```ts
function negate<Value>(predicate: Predicate<Value>): Predicate<Value>;
```

## Examples

```ts
negate((value: number) => value > 0)(-1); // true
```

## Edge cases

| Call                         | Result                    |
| ---------------------------- | ------------------------- |
| `negate(true)`               | throws `TypeError`        |
| The wrapped predicate throws | that exception propagates |
