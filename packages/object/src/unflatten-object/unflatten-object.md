# `unflattenObject`

Rebuilds a nested value from a flat record. Each own enumerable key is split on `delimiter`, which defaults to `"."`.

## Import

```ts
import { unflattenObject, type UnflattenObjectParams } from "@sgx4u/object";
```

## Signature

```ts
function unflattenObject(params: UnflattenObjectParams): unknown;
```

The tree is built from objects, then integer keys may become arrays.

| `arrays`   | Result                                                                                                           |
| ---------- | ---------------------------------------------------------------------------------------------------------------- |
| `"auto"`   | A node becomes an array only when its keys are exactly `"0"` through `"n-1"` with no holes. This is the default. |
| `"always"` | A node whose keys are all canonical integers becomes an array. Holes stay holes.                                 |
| `"never"`  | Every node stays an object. Integer keys stay strings.                                                           |

An empty node stays an object. A node with any non-integer key stays an object. A later flat key overwrites an earlier leaf or object at the same path. Leaf objects are stored as-is and are not treated as more path segments.

## Prototype keys

`"__proto__"`, `"prototype"`, and `"constructor"` are dangerous segments. `"skip"`, the default, drops the whole flat key, so `"__proto__.polluted"` and `"constructor.prototype.polluted"` do not set `({}).polluted` and do not leave an empty parent. `"throw"` raises `RangeError`. `"keep"` writes an own data property with `Object.defineProperty` and does not assign through `Object.prototype`.

## Examples

```ts
unflattenObject({ object: { "user.name": "Ada" } });
// { user: { name: "Ada" } }

unflattenObject({ object: { "a.0": "x", "a.1": "y" } });
// { a: ["x", "y"] }
```

`flattenObject` then `unflattenObject` round-trips a plain object that has no cycles, no dangerous keys, and no keys that contain the delimiter. An object whose own keys are exactly `"0"` through `"n-1"` comes back as an array in `"auto"` mode.

## Edge cases

`null`, primitives, and arrays return `undefined`. Unknown `arrays` or `prototypeKeys`, and an empty `delimiter`, throw `RangeError`. The input is not mutated.
