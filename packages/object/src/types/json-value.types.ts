/**
 * A JSON object. Keys are strings. Values are JSON values.
 */
export type JSONObject = { [key: string]: JSONValue };

/**
 * A JSON array.
 */
export type JSONArray = JSONValue[];

/**
 * Data that `JSON.stringify` can represent without loss.
 *
 * `undefined`, functions, symbols, bigints, `NaN`, infinities, and cycles
 * are not JSON values.
 */
export type JSONValue =
    null | boolean | number | string | JSONArray | JSONObject;
