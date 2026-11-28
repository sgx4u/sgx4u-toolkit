import type { IsParseableBooleanInput } from "../types/parse-options.types.js";
import { normalizeParseRequest } from "../utils/normalize-parse-request.utils.js";
import { readBooleanToken } from "../utils/read-boolean-token.utils.js";
import { resolveParseSettings } from "../utils/resolve-parse-settings.utils.js";

/**
 * Reports whether `parseBoolean` would return `true` or `false` for this
 * call if `fallback` were omitted.
 *
 * The argument is the value alone, or one flat object that owns `value`
 * and the same options as `parseBoolean`, except `fallback`. A fallback on
 * the object is validated and then ignored, so an unrecognized value still
 * returns `false`. The value under test never causes a throw. A bad option
 * still does.
 *
 * @param value - A candidate token.
 * @returns `true` when the value is a recognized boolean token.
 * @throws {TypeError} When an option has the wrong type.
 * @throws {RangeError} When the folded truthy and falsy words share a word.
 * @example
 * isParseableBoolean("maybe"); // false
 */
export function isParseableBoolean(input: IsParseableBooleanInput): boolean;
/**
 * @param value - A candidate token, with default parse options.
 * @returns `true` when the value is a recognized boolean token.
 */
export function isParseableBoolean(value: unknown): boolean;
export function isParseableBoolean(valueOrInput: unknown): boolean {
    const request = normalizeParseRequest(valueOrInput);
    const settings = resolveParseSettings(request.options);
    return readBooleanToken(request.value, settings) !== undefined;
}
