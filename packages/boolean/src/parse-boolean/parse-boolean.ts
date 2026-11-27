import type { ParseBooleanInput } from "../types/parse-options.types.js";
import { normalizeParseRequest } from "../utils/normalize-parse-request.utils.js";
import { readBooleanToken } from "../utils/read-boolean-token.utils.js";
import { resolveParseSettings } from "../utils/resolve-parse-settings.utils.js";

/**
 * Turns `value` into `true` or `false` when it is a recognized token.
 *
 * Pass the value on its own, or one flat object that owns `value` plus any
 * options. There is no `(value, options)` form. Primitive `true` and
 * `false` are returned as themselves. The numbers `0` and `1` are accepted,
 * and `-0` is `false` because `-0 === 0`. Strings match the English tokens
 * (`true`, `t`, `yes`, `y`, `on`, `1`, `enable`, `enabled`, and the false
 * counterparts) after trim and case-folding. A `locale` adds that
 * language's yes/no words in `"extend"` mode. `lenient` then allows
 * English `yes` or `no` with one neighboring-key typo.
 *
 * `null`, `""`, `"maybe"`, `"2"`, `"1.0"`, `NaN`, objects, and arrays are
 * not tokens. They return `fallback` when one was given, otherwise
 * `undefined`. The input is not mutated.
 *
 * @param input - `value` plus parse options. `fallback` makes the result a boolean.
 * @returns The recognized boolean, or `fallback` when the token is missed.
 * @throws {TypeError} When an option has the wrong type.
 * @throws {RangeError} When the folded truthy and falsy words share a word. The message names that word.
 * @example
 * parseBoolean({ value: "maybe", fallback: false }); // false
 */
export function parseBoolean(
    input: ParseBooleanInput & { fallback: boolean },
): boolean;
/**
 * @param input - `value` plus parse options, without `fallback`.
 * @returns `undefined` when `value` is not recognized.
 * @throws {TypeError} When an option has the wrong type.
 * @throws {RangeError} When the folded truthy and falsy words share a word.
 * @example
 * parseBoolean({ value: "oui", locale: "fr" }); // true
 */
export function parseBoolean(input: ParseBooleanInput): boolean | undefined;
/**
 * @param value - A candidate token, with default parse options.
 * @returns The recognized boolean, or `undefined` when it is not a token.
 * @example
 * parseBoolean(" YES "); // true
 */
export function parseBoolean(value: unknown): boolean | undefined;
export function parseBoolean(valueOrInput: unknown): boolean | undefined {
    const request = normalizeParseRequest(valueOrInput);
    const settings = resolveParseSettings(request.options);
    const parsed = readBooleanToken(request.value, settings);
    if (parsed !== undefined) {
        return parsed;
    }
    return settings.fallback;
}
