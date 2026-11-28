import { readEnum, readRequiredString } from "../utils/assertions.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import type { GetSubstringBetweenOptions } from "./get-substring-between.types.js";

/**
 * Returns the text between the first `start` and the next `end`.
 *
 * `missing` chooses `""` or the whole string when either marker is absent.
 * The input is not changed.
 *
 * @param options - `value`, `start`, `end`, and `missing`.
 * @returns The piece, or `undefined` when `value` is not a string.
 * @throws {@link TypeError} When `start` or `end` is not a string.
 * @throws {@link RangeError} When `missing` is not `"empty"` or `"whole"`.
 * @example
 * getSubstringBetween({ value: "a[b]c", start: "[", end: "]" });
 */
export function getSubstringBetween(
    options: GetSubstringBetweenOptions,
): string | undefined {
    const resolved = readOptionsCall(options, (record) => ({
        start: readRequiredString("start", record.start),
        end: readRequiredString("end", record.end),
        missing: readEnum(
            "missing",
            record.missing,
            ["empty", "whole"] as const,
            "empty",
        ),
    }));
    if (resolved === undefined || typeof resolved.record.value !== "string")
        return undefined;
    const value = resolved.record.value;
    const startIndex = value.indexOf(resolved.options.start);
    if (startIndex === -1)
        return resolved.options.missing === "whole" ? value : "";
    const from = startIndex + resolved.options.start.length;
    const endIndex = value.indexOf(resolved.options.end, from);
    if (endIndex === -1)
        return resolved.options.missing === "whole" ? value : "";
    return value.slice(from, endIndex);
}
