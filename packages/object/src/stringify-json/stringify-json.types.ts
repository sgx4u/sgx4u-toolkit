/**
 * What `stringifyJSON` does when a value points at an ancestor.
 *
 * `"throw"` raises `RangeError`. `"skip"` omits the object key and writes
 * `null` for an array element. `"replace"` writes the string `"[Circular]"`.
 */
export type StringifyCircular = "throw" | "skip" | "replace";

/**
 * Arguments for the options form of `stringifyJSON`.
 */
export interface StringifyJSONParams {
    /** The value to stringify. */
    value: unknown;
    /**
     * Indent, using the same rules as `JSON.stringify`.
     *
     * A number becomes that many spaces, capped at 10. A string is used as
     * the indent, capped at 10 characters.
     */
    space?: string | number;
    /**
     * Sort object keys by UTF-16 code unit order.
     *
     * Array order is unchanged. The sort is `Array.prototype.sort` on the
     * keys, not `localeCompare`.
     *
     * @defaultValue `false`
     */
    stable?: boolean;
    /**
     * What to do when a value points at an ancestor.
     *
     * @defaultValue `"throw"`
     */
    circular?: StringifyCircular;
}
