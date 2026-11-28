import { readBoolean } from "../utils/assertions.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type { IsNumericStringOptions } from "./is-numeric-string.types.js";

/**
 * Reports whether `value` is an ASCII number.
 *
 * Digits are required. `allowSign` accepts one leading `+` or `-`.
 * `allowDecimal` accepts one dot with digits on both sides. An empty
 * string returns `false`. The input is not changed.
 *
 * @param value - The string to test.
 * @returns `true` when the string matches the numeric shape.
 * @throws {@link TypeError} When a flag is present and is not a boolean.
 * @example
 * isNumericString("42");
 */
export function isNumericString(value: unknown): boolean;
/**
 * @param options - `value` plus the sign and decimal flags.
 * @returns `true` when the string matches the numeric shape.
 */
export function isNumericString(options: IsNumericStringOptions): boolean;
/**
 * @param valueOrOptions - A string, or `value` plus flags.
 * @returns `true` when the string matches the numeric shape.
 */
export function isNumericString(valueOrOptions: unknown): boolean {
    const resolved = readStringCall(valueOrOptions, (record) => ({
        allowSign: readBoolean("allowSign", record.allowSign, false),
        allowDecimal: readBoolean("allowDecimal", record.allowDecimal, false),
    }));
    if (resolved === undefined || resolved.value.length === 0) {
        return false;
    }
    const sign = resolved.options.allowSign ? "[+-]?" : "";
    const fraction = resolved.options.allowDecimal ? "(?:\\.\\d+)?" : "";
    return new RegExp(`^${sign}\\d+${fraction}$`, "u").test(resolved.value);
}
