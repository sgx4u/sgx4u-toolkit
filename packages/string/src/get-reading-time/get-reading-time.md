# `getReadingTime`

Estimates reading time. The default rate is 200 words per minute.

## Import

```ts
import { getReadingTime } from "@sgx4u/string";
```

## Signature

```ts
function getReadingTime(
    value: string,
): { words: number; minutes: number } | undefined;
```

## Examples

```ts
getReadingTime("one two");
```

## Edge cases

A non-positive rate throws `RangeError`.
