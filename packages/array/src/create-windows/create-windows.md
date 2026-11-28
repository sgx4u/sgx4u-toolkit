# `createWindows`

Copies windows that start at `0`, `step`, `2 * step`, and so on. `step` defaults to `1`. `partial` defaults to `true`, so a window that runs into the end of the array is kept. Set `partial` to `false` to drop a window shorter than `size`.

## Import

```ts
import { createWindows, type CreateWindowsParams } from "@sgx4u/array";
```

## Signature

```ts
function createWindows<Item>(
    params: CreateWindowsParams<Item>,
): Item[][] | undefined;
```

## Parameters

| Name      | Type              | Default | Description                                                        |
| --------- | ----------------- | ------- | ------------------------------------------------------------------ |
| `array`   | `readonly Item[]` |         | Items the windows are copied from.                                 |
| `size`    | `number`          |         | Length of a full window. Must be a positive finite integer.        |
| `step`    | `number`          | `1`     | Distance between window starts. Must be a positive finite integer. |
| `partial` | `boolean`         | `true`  | When `false`, a short trailing window is dropped.                  |

## Examples

```ts
createWindows({ array: [1, 2, 3, 4], size: 3, step: 2 });
// [[1, 2, 3], [3, 4]]
```

## Edge cases

- A non-object returns `undefined`. A non-array `array` returns `undefined` when `size` and `step` are valid.
- `size` and `step` are checked before `array`. `0`, a fraction, and a non-number throw.
- An empty array returns `[]`. A window that would be the whole array is still a new array.
- Holes are copied as `undefined`. The input is not mutated.
