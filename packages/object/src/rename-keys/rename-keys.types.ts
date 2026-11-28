/**
 * Old key names mapped to the names that replace them.
 *
 * A value that is not a string, number, or symbol is ignored, and the
 * original key is kept.
 */
export type RenameMapping = Readonly<Record<string, PropertyKey>>;

/**
 * Arguments for `renameKeys`.
 */
export interface RenameKeysParams {
    /**
     * The dictionary to rename.
     *
     * `null`, primitives, and arrays return `undefined`. A plain object that
     * contains arrays of objects is valid.
     */
    object: unknown;

    /** Keys to rename. Keys that are absent keep their names. */
    mapping: RenameMapping;

    /**
     * When true, also rename nested plain objects and objects inside arrays.
     *
     * @defaultValue `false`
     */
    deep?: boolean;
}
