# `escapeHTMLEntities`

Escapes text with named HTML entities where the chosen level has a name, and a decimal reference otherwise.

## Import

```ts
import { escapeHTMLEntities } from "@sgx4u/string/html-entities";
```

## Signature

```ts
function escapeHTMLEntities(value: string): string | undefined;
```

## Examples

```ts
escapeHTMLEntities("<"); // "&lt;"
```

## Edge cases

`level` is `xml`, `html4`, or `html5`. An unknown level throws `RangeError`.
