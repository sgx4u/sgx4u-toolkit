# `highlightMatches`

Wraps literal matches. The text is HTML-escaped first unless `escapeValue` is false.

## Import

```ts
import { highlightMatches } from "@sgx4u/string";
```

## Signature

```ts
function highlightMatches(options: {
    value: string;
    query: string;
    prefix?: string;
    suffix?: string;
    ignoreCase?: boolean;
    escapeValue?: boolean;
}): string | undefined;
```

## Examples

```ts
highlightMatches({ value: "hello", query: "ell" });
```

## Edge cases

The default prefix is `<mark>` and the default suffix is `</mark>`.
