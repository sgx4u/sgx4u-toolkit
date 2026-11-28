import { parseJSON } from "../parse-json/parse-json.js";

/**
 * Reports whether `text` is JSON text `parseJSON` accepts.
 *
 * Non-strings return `false`. The function does not throw.
 *
 * @param text - Any value. Only strings can be valid.
 * @returns `true` when `text` is a string of JSON.
 * @example
 * isValidJSON('{"id":1}');
 */
export function isValidJSON(text: unknown): boolean {
    if (typeof text !== "string") {
        return false;
    }
    try {
        return parseJSON(text) !== undefined;
    } catch {
        return false;
    }
}
