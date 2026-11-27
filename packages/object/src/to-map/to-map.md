# `toMap`

Copies the own enumerable string keys of an object into a `Map`.

## Import

```ts
import { toMap } from "@sgx4u/object";
```

## Signature

```ts
function toMap(object: unknown): Map<string, unknown> | undefined;
```

## Behavior

Insertion order is preserved. Symbol keys are not included. Array indexes are the strings `"0"`, `"1"`, and so on. A value that is not object-like returns `undefined`. The input is not mutated.

## Examples

```ts
toMap({ id: 1, name: "Ada" });
// Map { "id" => 1, "name" => "Ada" }
```

## Edge cases

| Value                              | Result                   |
| ---------------------------------- | ------------------------ |
| Plain object                       | A map of its string keys |
| Array                              | Index names as strings   |
| Object with symbol keys            | Those symbols are absent |
| `null`, a primitive, or a function | `undefined`              |
