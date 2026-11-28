# `createHTMLEntities`

Returns the HTML entity functions with `level` bound in. The default level is `html5`.

## Import

```ts
import { createHTMLEntities } from "@sgx4u/string/html-entities";
```

## Signature

```ts
function createHTMLEntities(
    config?: StringConfig & { level?: "xml" | "html4" | "html5" },
): HTMLEntitiesLibrary;
```

## Examples

```ts
createHTMLEntities({ level: "xml" }).escapeHTMLEntities("'"); // "&apos;"
```

## Edge cases

An unknown config key throws `RangeError`.
