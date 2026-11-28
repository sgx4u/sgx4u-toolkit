/**
 * Arguments for `omit`.
 */
export interface OmitParams {
    /** A plain object. Arrays, primitives, and `null` return `undefined`. */
    object: unknown;

    /**
     * Own enumerable string keys to leave out.
     *
     * A number matches the string key of the same digits. A value that is
     * not an array returns `undefined`.
     */
    keys: readonly PropertyKey[];
}
