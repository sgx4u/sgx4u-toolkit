# `createObjectHash`

Returns a frozen hash API after validating `ObjectConfig`. `canonicalizeJSON` and `hashObject` do not read the config. Validation still runs, so a bad config throws before the object is returned.

Each call checks its own config. There is no shared mutable state, so two instances do not affect each other. Changing the config object after the call does not change the instance.

## Import

```ts
import { createObjectHash } from "@sgx4u/object/hash";
```

## Signature

```ts
function createObjectHash(config?: ObjectConfig): ObjectHash;
```

```ts
interface ObjectHash {
    readonly canonicalizeJSON: typeof canonicalizeJSON;
    readonly hashObject: typeof hashObject;
}
```

`hashObject` keeps its overloads: `"sha256"` returns a promise, and omitted or `"fnv1a64"` returns a string.

## Validation

`config` must be a plain object when it is present. Unknown keys are ignored. `pathStyle`, `pathDelimiter`, `prototypeKeys`, `arrayMerge`, `circular`, `prototypes`, and the boolean flags are checked. `keyCase`, `emptyValues`, `locale`, and `maxDepth` are ignored so this subpath stays within its size limit. They do not change hashing. `pathDelimiter` must be a non-empty string when it is set.

## Examples

```ts
const api = createObjectHash({ pathDelimiter: "." });

api.canonicalizeJSON({ b: 1, a: 2 }); // '{"a":2,"b":1}'
api.hashObject({ value: null }); // "5b9bc4ba528108e4"
```

## Edge cases

| `config`                                                                                   | Result                     |
| ------------------------------------------------------------------------------------------ | -------------------------- |
| omitted or `{}`                                                                            | the frozen API             |
| `{ extra: 1 }`                                                                             | the unknown key is ignored |
| `null`, an array, or a number                                                              | throws `TypeError`         |
| `{ pathDelimiter: "" }`                                                                    | throws `RangeError`        |
| `{ pathStyle: "nope" }`, `{ prototypeKeys: "nope" }`, or `{ arrayMerge: "nope" }`          | throws `RangeError`        |
| `{ keyCase: "nope" }`, `{ emptyValues: ["nope"] }`, `{ locale: 1 }`, or `{ maxDepth: -1 }` | ignored                    |
