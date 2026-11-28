import type { CircularPolicy } from "../types/object-config.types.js";

/**
 * Arguments for the options form of `sealDeep`.
 *
 * The options form is used only when the object owns `circular` and its own
 * string keys stay inside `value` and `circular`. `{ value: something }`
 * with no `circular` key is sealed as data.
 */
export interface SealDeepParams {
    /** The value to seal when `circular` is also an own key. */
    value: unknown;

    /**
     * What to do when a nested value points at an ancestor.
     *
     * `"throw"` raises `RangeError` before any object is sealed. `"skip"`
     * and `"replace"` visit the cycle once, the same as `"preserve"`.
     *
     * @defaultValue `"preserve"`
     */
    circular?: CircularPolicy;
}
