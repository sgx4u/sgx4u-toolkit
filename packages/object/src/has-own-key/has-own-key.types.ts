/**
 * Arguments for `hasOwnKey`.
 */
export interface HasOwnKeyParams {
    /** The value to inspect. `null` and primitives return `false`. */
    object: unknown;
    /** The property name. */
    key: PropertyKey;
}
