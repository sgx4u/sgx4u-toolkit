# `listCircularPaths`

Lists the formatted paths of edges that point at an ancestor. It does not throw for cycles or bad options, and it does not mutate the input.

## Import

```ts
import { listCircularPaths } from "@sgx4u/object";
```

## Signature

```ts
function listCircularPaths(value: unknown): string[];
function listCircularPaths(params: ListCircularPathsParams): string[];
```

The options object is recognized when it is plain, owns `value`, and owns no string key other than `value`, `pathStyle`, and `pathDelimiter`.

## Behavior

The walk uses the same children as `forEachChild`. A child that is currently an ancestor is recorded and not entered. A shared reference that is not an ancestor is not a cycle. Primitives and acyclic values return `[]`.

Paths default to dot form. `"json-pointer"` uses RFC 6901. An unknown `pathStyle` falls back to `"dot"`. A delimiter that is not a non-empty string falls back to `"."`.

## Examples

```ts
const box: { self?: object } = {};
box.self = box;
listCircularPaths(box); // ["self"]

listCircularPaths({ pathStyle: "json-pointer", value: box }); // ["/self"]
```

## Edge cases

| Value                                   | Result                    |
| --------------------------------------- | ------------------------- |
| Primitive, `null`, or an acyclic object | `[]`                      |
| The same child stored on two keys       | `[]`                      |
| An array whose element is the array     | `["[0]"]`                 |
| Unknown `pathStyle`                     | Dot paths                 |
| Two edges back to an ancestor           | Both paths, in walk order |
