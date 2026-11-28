/**
 * Arguments for `hasKey`.
 */
export interface HasKeyParams {
    /** The value to inspect. `null` and primitives return `false`. */
    object: unknown;
    /** The property name. */
    key: PropertyKey;
    /**
     * When true, inherited properties count.
     *
     * @defaultValue `false`
     */
    inherited?: boolean;
}
