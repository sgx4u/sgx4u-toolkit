# `isLatLong`

Reports whether a string is `latitude, longitude` with latitude -90..90 and longitude -180..180.

## Import

```ts
import { isLatLong } from "@sgx4u/string";
```

## Signature

```ts
function isLatLong(value: unknown): boolean;
```

## Examples

```ts
isLatLong("value");
```

## Edge cases

A non-string returns `false`.
