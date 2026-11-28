# `endsWith`

Reports whether a string ends with a search string. `position` is the end index in the chosen unit.

## Import

```ts
import { endsWith } from "@sgx4u/string";
```

## Signature

```ts
function endsWith(options: {
    value: string;
    search: string;
    position?: number;
}): boolean;
```

## Options

| Option       | Default            | Description                                                                                 |
| ------------ | ------------------ | ------------------------------------------------------------------------------------------- |
| `value`      |                    | Text to test. A non-string returns `false`.                                                 |
| `search`     |                    | Text to find at the end index. An empty search matches.                                     |
| `position`   | the length         | End index in `unit`, like `String.prototype.endsWith`. A negative position is clamped to 0. |
| `unit`       | `"grapheme"`       | `"grapheme"`, `"codePoint"`, or `"codeUnit"`.                                               |
| `ignoreCase` | `false`            | Ignore case and keep accents.                                                               |
| `locale`     | the runtime locale | Locale for the collator and grapheme boundaries.                                            |

## Examples

```ts
endsWith({ value: "hello", search: "lo" });
```

## Edge cases

A non-string returns `false`.
