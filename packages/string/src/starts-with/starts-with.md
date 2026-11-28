# `startsWith`

Reports whether a string starts with a search string. `position` is counted in the chosen unit.

## Import

```ts
import { startsWith } from "@sgx4u/string";
```

## Signature

```ts
function startsWith(options: {
    value: string;
    search: string;
    position?: number;
    ignoreCase?: boolean;
}): boolean;
```

## Options

| Option       | Default            | Description                                                 |
| ------------ | ------------------ | ----------------------------------------------------------- |
| `value`      |                    | Text to test. A non-string returns `false`.                 |
| `search`     |                    | Text to find at `position`. An empty search matches.        |
| `position`   | `0`                | Start index in `unit`. A negative position is clamped to 0. |
| `unit`       | `"grapheme"`       | `"grapheme"`, `"codePoint"`, or `"codeUnit"`.               |
| `ignoreCase` | `false`            | Ignore case and keep accents, using sensitivity `"accent"`. |
| `locale`     | the runtime locale | Locale for the collator and grapheme boundaries.            |

## Examples

```ts
startsWith({ value: "hello", search: "he" });
```

## Edge cases

A non-string returns `false`.
