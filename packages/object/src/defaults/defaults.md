# `defaults`

Fills missing and `undefined` keys on a shallow copy of `object`. `object` is the source of truth. Each defaults object then fills keys that are still missing or `undefined`. A present `null`, `0`, or `""` stays. Nested objects are shared, not merged. The result is a new dictionary. The inputs are left unchanged.

An array passed as `defaults` is a list of sources, not one array value. A single object is one source.

## Import

```ts
import { defaults } from "@sgx4u/object";
```

## Signature

```ts
function defaults(params: DefaultsParams): Record<string, unknown> | undefined;
```

## Options

`object` must be object-like. Otherwise the function returns `undefined`.

`defaults` is one object, or a readonly array of objects. A value that is neither object-like nor an array returns `undefined`. Non-objects inside an array are skipped.

## Example

```ts
defaults({
    object: { a: 1, b: undefined, c: null },
    defaults: { b: 2, c: 3, d: 4 },
});
// { a: 1, b: 2, c: null, d: 4 }
```

## Edge cases

| Input                                          | Result                                                           |
| ---------------------------------------------- | ---------------------------------------------------------------- |
| Present `null`, `0`, or `""`                   | Kept                                                             |
| Present `undefined`, or a missing key          | Filled by the first default that has that key                    |
| Nested object already present                  | Kept by reference. Its keys are not filled                       |
| `object` is an array                           | A new dictionary of the array's enumerable keys                  |
| Dangerous keys                                 | Skipped. A JSON `__proto__` payload does not set `({}).polluted` |
| `object` is `null`, a primitive, or a function | `undefined`                                                      |
