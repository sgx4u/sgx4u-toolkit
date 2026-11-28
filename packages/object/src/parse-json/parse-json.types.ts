/**
 * A `JSON.parse` reviver.
 *
 * `this` is the object that holds the key. Returning `undefined` deletes an
 * object key, matching `JSON.parse`.
 */
export type JSONReviver = (
    this: unknown,
    key: string,
    value: unknown,
) => unknown;

/**
 * Arguments for the options form of `parseJSON`.
 */
export interface ParseJSONParams {
    /** JSON text. A non-string returns `undefined`. */
    text: string;
    /**
     * Called for every value, from the inside out.
     *
     * A dangerous key is still dropped when this returns a value for it.
     */
    reviver?: JSONReviver;
}
