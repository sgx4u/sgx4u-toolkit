/**
 * Arguments for `revertObjectPatch`.
 */
export interface RevertObjectPatchParams {
    /** The value the inverse patch is applied to. It is not mutated. */
    object: unknown;
    /**
     * A diff produced by `diffObjects`, or any value to validate.
     *
     * A value that is not an `ObjectDiff` makes the function return `undefined`.
     */
    patch: unknown;
}
