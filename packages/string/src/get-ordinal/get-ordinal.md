# `getOrdinal`

Returns an English ordinal such as `1st`, `2nd`, `3rd`, or `11th`. Only English is supported.

## Import

```ts
import { getOrdinal } from "@sgx4u/string";
```

## Signature

```ts
function getOrdinal(options: {
    count: number;
    locale?: string;
}): string | undefined;
```

## Examples

```ts
getOrdinal({ count: 1 });
```

## Edge cases

11, 12, and 13 use `th`. An unsupported locale throws `RangeError`.
