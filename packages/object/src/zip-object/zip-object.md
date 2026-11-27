# `zipObject`

Builds an object by pairing each key with the value at the same index. Extra keys are set to `undefined`. Extra values are ignored. The inputs are left unchanged.

## Import

```ts
import { zipObject } from "@sgx4u/object";
```

## Signature

```ts
function zipObject(params: ZipObjectParams): ZippedObject | undefined;
```

## Options

`keys` is the list of property names. A non-array returns `undefined`. A string, number, or symbol is used. Any other entry is skipped. Number keys are stored as strings.

`values` is the list of paired values. When it is omitted or is not an array, every accepted key is set to `undefined`.

## Example

```ts
zipObject({ keys: ["a", "b"], values: [1] });
// { a: 1, b: undefined }
```

## Edge cases

| Input                                   | Result                                               |
| --------------------------------------- | ---------------------------------------------------- |
| More keys than values                   | The extra keys are own properties set to `undefined` |
| More values than keys                   | The extra values are ignored                         |
| `values` is not an array                | Every key is `undefined`                             |
| A hole in `values`                      | That key is `undefined`                              |
| `__proto__`, `prototype`, `constructor` | Skipped                                              |
| `keys` is not an array                  | `undefined`                                          |
