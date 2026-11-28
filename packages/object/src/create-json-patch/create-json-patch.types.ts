/**
 * Arguments for `createJSONPatch`.
 */
export interface CreateJSONPatchParams {
    /** The document before the change. */
    first: unknown;
    /** The document after the change. */
    second: unknown;
}
