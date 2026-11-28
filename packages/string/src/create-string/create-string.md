# `createString`

Returns the root functions with defaults bound in. A value on one call overrides the default. Two instances do not share state.

## Import

```ts
import { createString } from "@sgx4u/string";
```

## Signature

```ts
function createString(config?: StringConfig): StringLibrary;
```

## Examples

```ts
const strings = createString({ locale: "tr-TR" });
strings.toLowerCase("I"); // "ı"
```

## Edge cases

An unknown config key throws `RangeError`.
