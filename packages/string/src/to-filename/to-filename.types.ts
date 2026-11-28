/**
 * Options for {@link toFilename}.
 *
 * Pass a single path segment, such as `report.txt`. A directory string is
 * not split into parts: `\` and `/` are reserved characters and are
 * replaced like any other reserved character.
 */
export interface ToFilenameOptions {
    /**
     * The file name to clean. This should be a base name, not a path.
     */
    value: string;
    /**
     * Text written in place of a run of reserved or control characters.
     *
     * Reserved and control characters inside the replacement are removed
     * so the result stays one safe segment. When that leaves the
     * replacement empty, those characters are deleted.
     *
     * @defaultValue `"-"`
     */
    replacement?: string;
    /**
     * Maximum number of graphemes in the result.
     *
     * The length counts graphemes, not bytes. It must be an integer of at
     * least 1 so the empty-name placeholder `_` can fit.
     *
     * @defaultValue 255
     */
    maximumLength?: number;
}
