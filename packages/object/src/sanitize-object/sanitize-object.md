# `sanitizeObject`

Copies an object and drops `__proto__`, `prototype`, and `constructor`. The input is not mutated.

## Import

```ts
import { sanitizeObject } from "@sgx4u/object";
```

## Signature

```ts
function sanitizeObject(object: unknown): object | undefined;
function sanitizeObject(params: {
    object: unknown;
    deep?: boolean;
}): object | undefined;
```

The options object is recognized when it is plain, owns `object`, and owns no string key other than `object` and `deep`.

## Behavior

`deep` defaults to true. A deep copy uses `cloneDeepValue` with prototypes stripped, dangerous keys skipped, and cycles preserved on the clone. A null prototype stays null. A class instance becomes a plain object of its own enumerable string keys.

`deep: false` copies one level. Nested values are shared, and dangerous keys are dropped only at that level. Arrays are sliced. A value that is not object-like returns `undefined`.

## Examples

```ts
sanitizeObject({ id: 1 }); // { id: 1 }

sanitizeObject({ deep: false, object: { id: 1, nested: { ok: 2 } } });
```

## Edge cases

| Call                          | Result                                      |
| ----------------------------- | ------------------------------------------- |
| Own dangerous key             | Dropped, at every level when `deep` is true |
| `deep: false`                 | Nested objects are the same references      |
| Cycle                         | The clone points at the cloned node         |
| `null`, a string, or a number | `undefined`                                 |
