/**
 * The direction `sortKeys` writes keys.
 */
export type SortOrder = "ascending" | "descending";

/**
 * Compares two string keys.
 *
 * A negative result puts `left` first when `order` is `"ascending"`.
 * `"descending"` calls this function with the arguments swapped.
 */
export type KeyCompare = (left: string, right: string) => number;

/**
 * Arguments for `sortKeys`.
 */
export interface SortKeysParams {
    /**
     * The plain object or array to copy.
     *
     * `null` and primitives return `undefined`. Arrays keep element order.
     */
    object: unknown;

    /**
     * When true, also sort keys of nested plain objects and of objects inside arrays.
     *
     * @defaultValue `true`
     */
    deep?: boolean;

    /**
     * Locales passed to `localeCompare` when `compare` is omitted.
     *
     * A string or a readonly list of locale names. Omit it to use the runtime locale.
     */
    locale?: string | readonly string[];

    /**
     * Passed to `localeCompare` as `{ numeric }` when `compare` is omitted.
     *
     * Numeric order puts `"a2"` before `"a10"`.
     *
     * @defaultValue `true`
     */
    numeric?: boolean;

    /**
     * Whether sorted keys run from low to high.
     *
     * @defaultValue `"ascending"`
     */
    order?: SortOrder;

    /**
     * Replaces the default `localeCompare` ordering.
     *
     * @throws {TypeError} When the property is present and is not a function.
     */
    compare?: KeyCompare;
}
