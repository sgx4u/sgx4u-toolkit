# `pluralize`

Returns the English plural, or the singular when `count` is 1. Only English locales are supported. `index` becomes `indexes`. `octopus` becomes `octopuses`.

## Import

```ts
import { pluralize } from "@sgx4u/string";
```

## Signature

```ts
function pluralize(value: string): string | undefined;
```

## Examples

```ts
pluralize("city");
```

## Edge cases

An unsupported locale such as `fr` throws `RangeError` so the caller does not get silent English.
