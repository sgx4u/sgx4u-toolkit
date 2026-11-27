# `maskValues`

Returns a copy of an object with selected paths replaced. The input is not mutated.

## Import

```ts
import { maskValues } from "@sgx4u/object";
```

## Signature

```ts
function maskValues(params: MaskValuesParams): unknown;
```

## Behavior

Each path is parsed with `pathStyle` and `pathDelimiter`. The default style is `"dot"` and the default delimiter is `"."`. A path is written only when `readPathSegments` finds it. Missing and illegal paths are ignored. The replacement defaults to `"[Redacted]"`.

Unchanged parts of the tree keep their references. When no path is found, the same object is returned. A value that is not object-like returns `undefined`. Dangerous path segments are skipped by the path reader.

## Examples

```ts
maskValues({
    object: { password: "secret", id: 1 },
    paths: ["password"],
}); // { password: "[Redacted]", id: 1 }
```

## Edge cases

| Call                                         | Result                                  |
| -------------------------------------------- | --------------------------------------- |
| Missing path, or a path such as `"a..b"`     | Ignored                                 |
| No path found                                | The same reference                      |
| `null` or a primitive                        | `undefined`                             |
| Invalid `pathStyle` or empty `pathDelimiter` | `RangeError`                            |
| JSON pointer path                            | Parsed with `pathStyle: "json-pointer"` |
