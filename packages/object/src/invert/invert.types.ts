/**
 * How `invert` treats values that stringify to the same key.
 *
 * `"last"` keeps the latest key. `"first"` keeps the earliest.
 * `"array"` groups every original key. `"throw"` raises `RangeError`.
 */
export type DuplicateValues = "last" | "first" | "array" | "throw";

/**
 * A map from inverted values to one original key.
 */
export type InvertMap = Record<string, string>;

/**
 * A map from inverted values to every original key, in enumeration order.
 */
export type InvertGroups = Record<string, string[]>;

/**
 * Either shape `invert` can return.
 */
export type InvertResult = InvertMap | InvertGroups;

/**
 * Arguments for the options form of `invert`.
 */
export interface InvertParams {
    /**
     * The dictionary to invert.
     *
     * `null`, primitives, and arrays return `undefined`.
     */
    object: unknown;

    /**
     * What to do when two values produce the same key.
     *
     * @defaultValue `"last"`
     */
    duplicateValues?: DuplicateValues;
}
