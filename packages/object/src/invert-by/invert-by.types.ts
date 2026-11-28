/**
 * Builds the group key for one entry.
 *
 * The return value is stringified. The default iteratee stringifies the value.
 */
export type InvertByIteratee = (
    value: unknown,
    key: string,
    object: Readonly<Record<string, unknown>>,
) => unknown;

/**
 * Arguments for `invertBy`.
 */
export interface InvertByParams {
    /**
     * The dictionary whose keys are grouped.
     *
     * `null`, primitives, and arrays return `undefined`.
     */
    object: unknown;

    /**
     * Computes the group for one entry. Omit it to group by `String(value)`.
     *
     * @throws {TypeError} When the property is present and is not a function.
     */
    iteratee?: InvertByIteratee;
}
