# `toggle`

Flips a primitive boolean. The result is the same as [`not`](../not/not.md). `toggle` is the everyday name. A value that is not a primitive boolean returns `undefined`. The function never throws.

## Import

```ts
import { toggle } from "@sgx4u/boolean";
```

## Signature

```ts
function toggle(value: unknown): boolean | undefined;
```

## Examples

```ts
toggle(false); // true
toggle(1); // undefined
```

## Edge cases

| Value           | Result      |
| --------------- | ----------- |
| `true`          | `false`     |
| `false`         | `true`      |
| Any non-boolean | `undefined` |
