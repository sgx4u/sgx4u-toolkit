/**
 * Arguments for `splitObject`.
 */
export interface SplitObjectParams {
    /** A plain object. Arrays, primitives, and `null` return `undefined`. */
    object: unknown;

    /**
     * Own enumerable string keys to place in `picked`.
     *
     * Every other enumerable string key is placed in `omitted`. A number
     * matches the string key of the same digits.
     */
    keys: readonly PropertyKey[];
}

/**
 * The two sides of a `splitObject` call.
 *
 * Both objects are new. Nested values are the same references as the input.
 */
export interface SplitObjectResult {
    /** Own enumerable string keys named by `keys` and present on the input. */
    picked: Record<string, unknown>;

    /** Own enumerable string keys that were not named. */
    omitted: Record<string, unknown>;
}
