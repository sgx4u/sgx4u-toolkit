# `formatObjectPath`

Formats segments as a dot path or a JSON Pointer. This is the inverse of `parseObjectPath` for the segments that reader produces, with one limit: a number is written as `[n]` in a dot path, and the dot reader does not accept that bracket text. A JSON Pointer round-trips, including indexes. The segment array is not mutated.

## Import

```ts
import { formatObjectPath } from "@sgx4u/object";
```

## Signature

```ts
function formatObjectPath(params: FormatObjectPathParams): string | undefined;
```

## Options

| Option          | Type                        | Default | Description                                                         |
| --------------- | --------------------------- | ------- | ------------------------------------------------------------------- |
| `segments`      | `readonly PathSegment[]`    |         | Segments to format. A non-array returns `undefined`.                |
| `pathStyle`     | `"dot"` or `"json-pointer"` | `"dot"` | How the segments are written. An unknown value raises `RangeError`. |
| `pathDelimiter` | `string`                    | `"."`   | Separator for a dot path. An empty string raises `RangeError`.      |

## Example

```ts
formatObjectPath({ segments: ["a", "b", 0] });
// "a.b[0]"

formatObjectPath({ segments: ["a", "b"], pathStyle: "json-pointer" });
// "/a/b"
```

## Edge cases

| Case                                              | Result                                                                          |
| ------------------------------------------------- | ------------------------------------------------------------------------------- |
| String segments `["a", "b"]`                      | `"a.b"`, which `parseObjectPath` reads back as `["a", "b"]`.                    |
| A number in a dot path                            | `[n]`, for example `"a.b[0]"`. `parseObjectPath("a.b[0]")` returns `undefined`. |
| A number in a JSON Pointer                        | `"/a/0"`, which parses back to `["a", 0]`.                                      |
| A segment that is not a string or a finite number | `undefined`.                                                                    |
| `segments` is not an array                        | `undefined`.                                                                    |
