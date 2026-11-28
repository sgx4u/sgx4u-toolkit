/**
 * One RFC 6902 JSON Patch operation.
 *
 * `from` is required for `"move"` and `"copy"`. `value` is required for
 * `"add"`, `"replace"`, and `"test"`. `"remove"` uses `path` only.
 * `createJSONPatch` does not emit `"move"`; `applyJSONPatch` still accepts it.
 */
export interface JSONPatchOperation {
    /** The operation name. */
    op: "add" | "remove" | "replace" | "move" | "copy" | "test";

    /**
     * Target location, as an RFC 6901 JSON Pointer.
     *
     * `""` is the whole document.
     */
    path: string;

    /**
     * Source location for `"move"` and `"copy"`.
     *
     * An RFC 6901 JSON Pointer.
     */
    from?: string;

    /** The value carried by `"add"`, `"replace"`, and `"test"`. */
    value?: unknown;
}
