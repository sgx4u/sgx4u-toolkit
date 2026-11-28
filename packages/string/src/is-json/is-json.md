# `isJSON`

Reports whether a string is valid JSON. It does not throw. An empty string returns `false`. `null` as JSON text returns `true`.

## Import

```ts
import { isJSON } from "@sgx4u/string";
```

## Signature

```ts
function isJSON(value: unknown): boolean;
```

## Examples

```ts
isJSON("value");
```

## Edge cases

A non-string returns `false`.
