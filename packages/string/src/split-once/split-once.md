# `splitOnce`

Splits on the first or last occurrence of a separator. A missing separator returns `undefined`.

## Import

```ts
import { splitOnce } from "@sgx4u/string";
```

## Signature

```ts
function splitOnce(options: {
    value: string;
    separator: string;
    from?: "start" | "end";
}): [string, string] | undefined;
```

## Options

| Option      | Default   | Description                                                |
| ----------- | --------- | ---------------------------------------------------------- |
| `value`     |           | Text to split. A non-string returns `undefined`.           |
| `separator` |           | Literal separator. An empty separator throws `RangeError`. |
| `from`      | `"start"` | `"start"` uses the first match. `"end"` uses the last.     |

## Examples

```ts
splitOnce({ value: "a-b-c", separator: "-" });
```

## Edge cases

An empty separator throws `RangeError`.
