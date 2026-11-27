/**
 * Arguments for the options form of `getObjectSize`.
 */
export interface GetObjectSizeParams {
    /** The value to measure. A non-object returns `undefined`. */
    object: unknown;
    /**
     * When true, add the key counts of nested plain objects and arrays.
     * Each object is counted once, so a cycle does not loop.
     *
     * @defaultValue `false`
     */
    deep?: boolean;
    /**
     * Count symbol keys as well as string keys.
     *
     * @defaultValue `false`
     */
    includeSymbols?: boolean;
}
