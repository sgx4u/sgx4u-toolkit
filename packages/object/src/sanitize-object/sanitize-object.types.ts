/**
 * Arguments for the options form of `sanitizeObject`.
 */
export interface SanitizeObjectParams {
    /**
     * The value to copy.
     *
     * A value that is not object-like returns `undefined`.
     */
    object: unknown;
    /**
     * Copy nested values.
     *
     * When false, one level is copied and nested values are shared.
     *
     * @defaultValue `true`
     */
    deep?: boolean;
}
