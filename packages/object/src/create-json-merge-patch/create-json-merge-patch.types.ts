/**
 * Arguments for `createJSONMergePatch`.
 */
export interface CreateJSONMergePatchParams {
    /** The document before the change. */
    first: unknown;
    /** The document after the change. */
    second: unknown;
}
