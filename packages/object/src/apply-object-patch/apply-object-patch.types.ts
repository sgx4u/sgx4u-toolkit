/**
 * Arguments for `applyObjectPatch`.
 */
export interface ApplyObjectPatchParams {
    /** The value the patch is applied to. It is not mutated. */
    object: unknown;
    /**
     * A diff produced by `diffObjects`, or any value to validate.
     *
     * A value that is not an `ObjectDiff` makes the function return `undefined`.
     */
    patch: unknown;
}
