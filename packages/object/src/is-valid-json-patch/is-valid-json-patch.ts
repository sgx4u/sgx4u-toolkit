import { jsonPatchIssue } from "../utils/json-patch.utils.js";

/**
 * Reports whether `value` is an array of well-formed RFC 6902 operations.
 *
 * Each operation needs an `op` of `"add"`, `"remove"`, `"replace"`, `"move"`,
 * `"copy"`, or `"test"`, and a `path` that is an RFC 6901 pointer. `"add"`,
 * `"replace"`, and `"test"` need an own `value`. `"move"` and `"copy"` need
 * a `from` pointer. Extra fields are allowed. An empty array is valid.
 * The function does not throw.
 *
 * @param value - Any value.
 * @returns `true` when `value` is a well-formed JSON Patch.
 * @example
 * isValidJSONPatch([{ op: "remove", path: "/a" }]);
 */
export function isValidJSONPatch(value: unknown): boolean {
    return jsonPatchIssue(value) === undefined;
}
