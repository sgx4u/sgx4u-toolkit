import type { CircularPolicy } from "../types/object-config.types.js";

/**
 * Arguments for the options form of `freezeDeep`.
 *
 * The options form is used only when the object owns `circular` and its own
 * string keys are `value` and, optionally, nothing else besides `circular`.
 * `{ value: something }` with no `circular` key is frozen as data.
 */
export interface FreezeDeepParams {
    /** The value to freeze when `circular` is also an own key. */
    value: unknown;

    /**
     * What to do when a nested value points at an ancestor.
     *
     * `"throw"` raises `RangeError` before any object is frozen. `"skip"`
     * and `"replace"` visit the cycle once, the same as `"preserve"`, and
     * leave the graph in place.
     *
     * @defaultValue `"preserve"`
     */
    circular?: CircularPolicy;
}
