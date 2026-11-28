/**
 * Arguments for the options form of `createEmptyObject`.
 */
export interface CreateEmptyObjectParams {
    /**
     * The prototype of the new object.
     *
     * `null` creates an object with no prototype. The property must be own,
     * and the options object must not own any other string key.
     */
    prototype: object | null;
}
