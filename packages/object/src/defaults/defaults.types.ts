/**
 * Arguments for `defaults`.
 */
export interface DefaultsParams {
    /**
     * Source of truth.
     *
     * A value that is not object-like makes `defaults` return `undefined`.
     */
    object: unknown;

    /**
     * One object, or a list of objects, applied from left to right.
     *
     * A value that is neither object-like nor an array makes `defaults`
     * return `undefined`.
     */
    defaults: unknown;
}
