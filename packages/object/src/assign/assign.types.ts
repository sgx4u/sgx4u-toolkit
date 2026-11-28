/**
 * Arguments for `assign`.
 */
export interface AssignParams {
    /**
     * Sources copied from left to right.
     *
     * A non-array makes `assign` return `undefined`.
     */
    objects: readonly unknown[];
}
