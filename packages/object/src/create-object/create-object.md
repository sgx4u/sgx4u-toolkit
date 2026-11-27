# `createObject`

Builds a frozen set of the root functions with your defaults bound in. A field on a later call replaces the config for that call. Standalone functions keep their own defaults. Two instances do not share state.

## Import

```ts
import { createObject } from "@sgx4u/object";
```

## Signature

```ts
function createObject(config?: ObjectConfig): ObjectInstance;
```

## Config

| Field                          | Default when omitted                                                                         |
| ------------------------------ | -------------------------------------------------------------------------------------------- |
| `pathStyle`                    | `"dot"`                                                                                      |
| `pathDelimiter`                | `"."`                                                                                        |
| `arrayMerge`                   | `"replace"`                                                                                  |
| `prototypeKeys`                | `"skip"`                                                                                     |
| `circular`                     | Each function keeps its own default until this is set. `stringifyJSON` ignores `"preserve"`. |
| `keyCase`                      | `"camelCase"`, applied as `convertKeys` `case`                                               |
| `includeSymbols`               | `false`                                                                                      |
| `includeNonEnumerable`         | `false`                                                                                      |
| `emptyValues`                  | `["undefined"]`                                                                              |
| `locale`                       | The runtime locale                                                                           |
| `preserveConsecutiveUppercase` | `false`                                                                                      |
| `prototypes`                   | `"strip"`                                                                                    |
| `maxDepth`                     | `Infinity`                                                                                   |

`pathDelimiter` is also the default `delimiter` for `flattenObject`.

## Example

```ts
const object = createObject({ arrayMerge: "concat", prototypeKeys: "throw" });

object.mergeDeep({ objects: [{ tags: ["a"] }, { tags: ["b"] }] });
// { tags: ["a", "b"] }
```

## Edge cases

| Call                                               | Result                                              |
| -------------------------------------------------- | --------------------------------------------------- |
| `createObject()`                                   | Every function uses its built-in default.           |
| `createObject(null)`                               | Throws `TypeError`.                                 |
| `createObject({ pathDelimiter: "" })`              | Throws `RangeError`.                                |
| `createObject({ pathStyle: "dots" })`              | Throws `RangeError`.                                |
| `instance.createObject({ arrayMerge: "replace" })` | A new instance. The original instance is unchanged. |

The returned object is frozen.
