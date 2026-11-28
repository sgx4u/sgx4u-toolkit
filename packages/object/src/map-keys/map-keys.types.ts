/**
 * Returns the replacement key for one entry.
 *
 * `value` is the original value, before a deep map of its children.
 * `object` is the plain object that owns the key.
 */
export type KeyMapper = (
    key: string,
    value: unknown,
    object: Readonly<Record<string, unknown>>,
) => PropertyKey;

/**
 * Arguments for `mapKeys`.
 */
export interface MapKeysParams {
    /**
     * The dictionary whose keys are replaced.
     *
     * `null`, primitives, and arrays return `undefined`.
     */
    object: unknown;

    /**
     * Builds the new key. Dangerous results are skipped. A later duplicate wins.
     */
    mapper: KeyMapper;

    /**
     * When true, also map keys of nested plain objects and of objects inside arrays.
     *
     * @defaultValue `false`
     */
    deep?: boolean;
}
