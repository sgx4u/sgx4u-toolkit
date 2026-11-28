# `getLongestCommonSubstring`

Returns the longest contiguous shared substring. Ties keep the first occurrence in `first`.

## Import

```ts
import { getLongestCommonSubstring } from "@sgx4u/string";
```

## Signature

```ts
function getLongestCommonSubstring(options: {
    first: string;
    second: string;
}): string | undefined;
```

## Options

| Option   | Default | Description                                                                        |
| -------- | ------- | ---------------------------------------------------------------------------------- |
| `first`  |         | First string. Ties keep the earliest match here. A non-string returns `undefined`. |
| `second` |         | Second string. A non-string returns `undefined`.                                   |

## Examples

```ts
getLongestCommonSubstring({ first: "abcd", second: "bc" });
```

## Edge cases

No shared substring returns an empty string. A non-string returns `undefined`.
