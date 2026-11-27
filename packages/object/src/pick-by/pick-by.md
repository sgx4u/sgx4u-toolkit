# `pickBy`

Copies the own enumerable string keys for which `predicate` returns a truthy value. The predicate is called as `predicate(value, key, object)`. The result is a new object. The input is not mutated, and nested values keep their references.

## Import

```ts
import { pickBy } from "@sgx4u/object";
```

## Signature

```ts
function pickBy(params: PickByParams): Record<string, unknown> | undefined;
```

## Options

| Option      | Type                              | Description                                                |
| ----------- | --------------------------------- | ---------------------------------------------------------- |
| `object`    | `unknown`                         | Plain object to copy. Any other value returns `undefined`. |
| `predicate` | `(value, key, object) => boolean` | Return a truthy value to copy the key.                     |

## Example

```ts
pickBy({
    object: { id: 1, name: "Ada" },
    predicate: (value) => typeof value === "number",
});
// { id: 1 }
```

## Edge cases

| Case                                                   | Result                                             |
| ------------------------------------------------------ | -------------------------------------------------- |
| No key is selected                                     | A new empty object, not the input.                 |
| An own value of `undefined` that the predicate accepts | The key is copied and its value stays `undefined`. |
| Symbol keys                                            | Not visited.                                       |
| A dangerous key the predicate accepts                  | Written with `Object.defineProperty`.              |
| `object` is an array, `null`, or a primitive           | `undefined`. The predicate is not called.          |
| `predicate` is not a function                          | `TypeError`, including when `object` is invalid.   |
