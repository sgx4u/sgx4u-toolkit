/**
 * Arguments for `pick`.
 */
export interface PickParams {
    /** A plain object. Arrays, primitives, and `null` return `undefined`. */
    object: unknown;

    /**
     * Own keys to copy, in the order they should appear.
     *
     * Missing keys are left out. A value that is not an array returns
     * `undefined`.
     */
    keys: readonly PropertyKey[];
}
