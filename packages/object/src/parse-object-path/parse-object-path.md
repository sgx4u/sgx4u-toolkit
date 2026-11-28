# `parseObjectPath`

Parses path text into segments. A string uses dot style and `"."`. An options object is recognized when it is a plain object, owns `path`, and owns no keys outside `path`, `pathStyle`, and `pathDelimiter`.

An illegal string returns `undefined` and does not throw. An unknown `pathStyle` or an empty `pathDelimiter` on the options form raises `RangeError`. An empty string is the empty path and returns `[]`. Canonical indexes such as `"0"` become numbers. The text is not modified.

## Import

```ts
import { parseObjectPath } from "@sgx4u/object";
```

## Signature

```ts
function parseObjectPath(path: string): PathSegment[] | undefined;
function parseObjectPath(
    params: ParseObjectPathParams,
): PathSegment[] | undefined;
```

## Options

| Option          | Type                        | Default | Description                                                      |
| --------------- | --------------------------- | ------- | ---------------------------------------------------------------- |
| `path`          | `string`                    |         | Path text. A non-string on the options form returns `undefined`. |
| `pathStyle`     | `"dot"` or `"json-pointer"` | `"dot"` | How `path` is parsed. An unknown value raises `RangeError`.      |
| `pathDelimiter` | `string`                    | `"."`   | Separator for a dot path. An empty string raises `RangeError`.   |

The options form is used only when the argument is a plain object limited to those keys. A bare string does not read `pathStyle`.

## Example

```ts
parseObjectPath("a.b.0.c");
// ["a", "b", 0, "c"]

parseObjectPath({ path: "/a/b/0", pathStyle: "json-pointer" });
// ["a", "b", 0]
```

## Edge cases

| Case                                              | Result                                                                                                 |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `""`                                              | `[]`.                                                                                                  |
| `"a..b"`, `"."`, or an unfinished bracket         | `undefined`.                                                                                           |
| `"a.b[0].c"` or a path that ends in `]`           | `undefined`. The dot reader rejects an empty segment after a bracket. Use `a.b.0.c` or a JSON Pointer. |
| A number, or an object that also owns another key | `undefined`. It is not the options form.                                                               |
| `{ path: 1, pathStyle: "bad" }`                   | `RangeError` for `pathStyle`, before the non-string path returns `undefined`.                          |
