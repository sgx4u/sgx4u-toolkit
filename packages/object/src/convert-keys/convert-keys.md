# `convertKeys`

Copies a plain object and converts its keys to another case. Nested plain objects and objects inside arrays are converted when `deep` is true, which is the default.

## Import

```ts
import { convertKeys, type ConvertKeysParams } from "@sgx4u/object";
```

## Signature

```ts
function convertKeys(
    params: ConvertKeysParams,
): Record<string, unknown> | undefined;
```

`case` defaults to `"camelCase"`. A leading run of `_` and `$` is kept as a prefix. Words break on an ASCII uppercase letter, on a change between a letter and a digit, and on `-`, `_`, `.`, and whitespace.

`preserveConsecutiveUppercase` changes `camelCase` and `pascalCase` only. A run of two or more uppercase letters keeps that case. `snakeCase`, `kebabCase`, and `constantCase` still split the run. A single uppercase letter is not a run.

`upper` and `lower` do not insert separators. They change the case of the original text after the prefix, then put the prefix back.

## Case examples

| Key           | Preserve | Case     | Result         |
| ------------- | -------- | -------- | -------------- |
| `HTTPServer`  | `false`  | camel    | `httpServer`   |
| `HTTPServer`  | `false`  | pascal   | `HttpServer`   |
| `HTTPServer`  | `false`  | snake    | `http_server`  |
| `HTTPServer`  | `false`  | kebab    | `http-server`  |
| `HTTPServer`  | `false`  | constant | `HTTP_SERVER`  |
| `HTTPServer`  | `true`   | camel    | `HTTPServer`   |
| `HTTPServer`  | `true`   | pascal   | `HTTPServer`   |
| `HTTPServer`  | `true`   | snake    | `http_server`  |
| `HTTPServer`  | `true`   | kebab    | `http-server`  |
| `HTTPServer`  | `true`   | constant | `HTTP_SERVER`  |
| `userID`      | `false`  | camel    | `userId`       |
| `userID`      | `false`  | snake    | `user_id`      |
| `userID`      | `false`  | constant | `USER_ID`      |
| `userID`      | `true`   | camel    | `userID`       |
| `userID`      | `true`   | pascal   | `UserID`       |
| `userID`      | `true`   | snake    | `user_id`      |
| `userID`      | `true`   | constant | `USER_ID`      |
| `_privateKey` | `false`  | camel    | `_privateKey`  |
| `_privateKey` | `false`  | snake    | `_private_key` |
| `userID`      |          | upper    | `USERID`       |
| `userID`      |          | lower    | `userid`       |
| `_privateKey` |          | upper    | `_PRIVATEKEY`  |
| `_privateKey` |          | lower    | `_privatekey`  |
| `HTTPServer`  |          | upper    | `HTTPSERVER`   |
| `HTTPServer`  |          | lower    | `httpserver`   |
| `foo-bar`     |          | upper    | `FOO-BAR`      |

## Exclude and stop paths

A string in `exclude` matches the whole original key. A regular expression matches when `test` is true. The call does not change `lastIndex`.

`stopPaths` are matched against the original key names, before conversion. `pathStyle` chooses dot paths or JSON Pointers, both read by `resolvePathSegments`. The key named by the path may still be converted. Keys inside that subtree stay as they are, and that subtree keeps its original reference. A canonical integer segment matches an array index, so `item_list.0` and `/item_list/0` both select the first object in `item_list`.

## Examples

```ts
convertKeys({ object: { user_id: 1 } });
// { userId: 1 }

convertKeys({
    object: { user_name: { first_name: "A", address_info: { zip_code: "1" } } },
    stopPaths: ["user_name.address_info"],
});
// { userName: { firstName: "A", addressInfo: { zip_code: "1" } } }
```

## Edge cases

An unknown `case` or `pathStyle` throws `RangeError`. An unparsable stop path throws `RangeError`. `null`, primitives, and arrays return `undefined`. The input is not mutated. A dangerous result key is skipped. When two keys convert to the same name, the later value wins.
