import { readBoolean } from "../utils/assertions.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type { IsHexColorOptions } from "./is-hex-color.types.js";

export type { IsHexColorOptions } from "./is-hex-color.types.js";

/**
 * Resolved hex-color options after defaults are applied.
 */
interface HexColorCheckOptions {
    /** Whether 3-digit and 4-digit forms are accepted. */
    allowShort: boolean;
    /** Whether 4-digit and 8-digit forms are accepted. */
    allowAlpha: boolean;
}

/**
 * Reports whether `value` is a hexadecimal color.
 *
 * The leading `#` is optional. The default forms are `#RGB`, `#RGBA`,
 * `#RRGGBB`, and `#RRGGBBAA`. Digits are case-insensitive. A non-string
 * returns `false`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `value` is one of the allowed forms.
 * @throws {@link TypeError} When a flag is present and is not a boolean.
 * @example
 * isHexColor("#1a2b3c");
 */
export function isHexColor(value: unknown): boolean;
/**
 * @param options - `value`, `allowShort`, and `allowAlpha`.
 * @returns `true` when `value` is one of the allowed forms.
 */
export function isHexColor(options: IsHexColorOptions): boolean;
/**
 * @param valueOrOptions - A string, or `value` plus options.
 * @returns `true` when `value` is one of the allowed forms.
 */
export function isHexColor(valueOrOptions: unknown): boolean {
    const resolved = readStringCall(valueOrOptions, (record) => ({
        allowShort: readBoolean("allowShort", record.allowShort, true),
        allowAlpha: readBoolean("allowAlpha", record.allowAlpha, true),
    }));
    if (resolved === undefined) {
        return false;
    }
    return matchesHexColor(resolved.value, resolved.options);
}

/**
 * Whether `value` is a hexadecimal color for `options`.
 *
 * @param value - Candidate text.
 * @param options - Short and alpha flags.
 * @returns `true` when the digit length is allowed.
 */
function matchesHexColor(
    value: string,
    options: HexColorCheckOptions,
): boolean {
    const digits = value.startsWith("#") ? value.slice(1) : value;
    if (!/^[0-9A-Fa-f]+$/u.test(digits)) {
        return false;
    }
    const short = digits.length === 3 || digits.length === 4;
    const alpha = digits.length === 4 || digits.length === 8;
    if (short && !options.allowShort) {
        return false;
    }
    if (alpha && !options.allowAlpha) {
        return false;
    }
    return (
        digits.length === 3 ||
        digits.length === 4 ||
        digits.length === 6 ||
        digits.length === 8
    );
}
