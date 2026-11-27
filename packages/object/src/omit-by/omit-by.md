# `omitBy`

Copies a plain object without the own enumerable string keys for which `predicate` returns a truthy value. The predicate is called as `predicate(value, key, object)`. When every key is kept, the same object is returned. The input is not mutated, and nested values keep their references.

## Import

```ts
import { omitBy } from "@sgx4u/object";
```

## Signature

```ts
function omitBy(params: OmitByParams): Record<string, unknown> | undefined;
```

## Options

| Option      | Type                              | Description                                                |
| ----------- | --------------------------------- | ---------------------------------------------------------- |
| `object`    | `unknown`                         | Plain object to copy. Any other value returns `undefined`. |
| `predicate` | `(value, key, object) => boolean` | Return a truthy value to drop the key.                     |

## Example

```ts
omitBy({
    object: { id: 1, name: "Ada" },
    predicate: (value) => typeof value === "string",
});
// { id: 1 }
```

## Edge cases

| Case                                         | Result                                              |
| -------------------------------------------- | --------------------------------------------------- |
| The predicate returns false for every key    | The same object.                                    |
| A new result                                 | Symbol keys and non-enumerable keys are not copied. |
| A dangerous key that remains                 | Written with `Object.defineProperty`.               |
| `object` is an array, `null`, or a primitive | `undefined`. The predicate is not called.           |
| `predicate` is not a function                | `TypeError`, including when `object` is invalid.    |
