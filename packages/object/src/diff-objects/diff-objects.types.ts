/**
 * Arguments for `diffObjects`.
 */
export interface DiffObjectsParams {
    /** The starting value. */
    first: unknown;
    /** The value to compare against `first`. */
    second: unknown;
    /**
     * Compare enumerable symbol keys.
     *
     * When symbols differ, the object is reported as `"changed"` because a
     * property diff can only name string keys.
     *
     * @defaultValue `false`
     */
    includeSymbols?: boolean;
}
