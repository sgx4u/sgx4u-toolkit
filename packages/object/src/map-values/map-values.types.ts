/**
 * Returns the replacement value for one entry.
 *
 * When `deep` is true, a nested plain object or array has already been mapped.
 * `object` is the plain object that owns the key.
 */
export type ValueMapper = (
    value: unknown,
    key: string,
    object: Readonly<Record<string, unknown>>,
) => unknown;

/**
 * Arguments for `mapValues`.
 */
export interface MapValuesParams {
    /**
     * The dictionary whose values are replaced.
     *
     * `null`, primitives, and arrays return `undefined`.
     */
    object: unknown;

    /** Builds the new value. */
    mapper: ValueMapper;

    /**
     * When true, also map values of nested plain objects and of objects inside arrays.
     *
     * @defaultValue `false`
     */
    deep?: boolean;
}
