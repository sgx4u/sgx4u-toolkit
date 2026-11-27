# `fromMap`

Copies a `Map` into a plain object.

## Import

```ts
import { fromMap } from "@sgx4u/object";
```

## Signature

```ts
function fromMap(map: unknown): Record<string, unknown> | undefined;
```

## Behavior

String keys are copied in map order. Symbol keys are kept. Number keys, object keys, and every other non-string, non-symbol key are skipped. `__proto__`, `prototype`, and `constructor` are skipped, so they cannot change `Object.prototype`. A value that is not a `Map` returns `undefined`.

## Examples

```ts
fromMap(
    new Map([
        ["id", 1],
        ["name", "Ada"],
    ]),
);
// { id: 1, name: "Ada" }
```

## Edge cases

| Value                                         | Result         |
| --------------------------------------------- | -------------- |
| `Map` of string keys                          | A plain object |
| Number key                                    | Skipped        |
| Symbol key                                    | Copied         |
| `"__proto__"`, `"prototype"`, `"constructor"` | Skipped        |
| A plain object, array, or `WeakMap`           | `undefined`    |
