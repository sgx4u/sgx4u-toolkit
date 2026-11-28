# `isSemVer`

Reports whether a string is SemVer 2.0.0. A leading `v` is rejected.

## Import

```ts
import { isSemVer } from "@sgx4u/string";
```

## Signature

```ts
function isSemVer(value: unknown): boolean;
```

## Examples

```ts
isSemVer("value");
```

## Edge cases

A non-string returns `false`.
