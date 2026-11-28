import { readBoolean } from "../utils/assertions.utils.js";
import { measureDisplayWidth } from "../utils/display-width.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import type { GetDisplayWidthOptions } from "./get-display-width.types.js";

/**
 * Returns the monospaced columns `value` occupies.
 *
 * East Asian wide and fullwidth characters are 2. Ambiguous characters are
 * 1. Emoji graphemes, including ZWJ sequences and flags, are 2. Combining
 * marks and controls, including tab, are 0. ANSI escapes are ignored unless
 * `countAnsiEscapeCodes` is true, in which case each of their code units
 * counts as 1. The input is not changed.
 *
 * @param options - `value` and whether ANSI escapes count.
 * @returns The column count, or `undefined` when `value` is not a string.
 * @throws {@link TypeError} When `countAnsiEscapeCodes` is not a boolean.
 * @example
 * getDisplayWidth({ value: "あ" });
 */
export function getDisplayWidth(
    options: GetDisplayWidthOptions,
): number | undefined {
    const resolved = readOptionsCall(options, (record) => ({
        countAnsiEscapeCodes: readBoolean(
            "countAnsiEscapeCodes",
            record.countAnsiEscapeCodes,
            false,
        ),
    }));
    if (resolved === undefined || typeof resolved.record.value !== "string") {
        return undefined;
    }
    return measureDisplayWidth(
        resolved.record.value,
        resolved.options.countAnsiEscapeCodes,
    );
}
