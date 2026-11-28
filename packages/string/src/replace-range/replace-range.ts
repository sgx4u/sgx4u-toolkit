import { readInteger, readRequiredString } from "../utils/assertions.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import { clampIndex, readUnit, splitIntoUnits } from "../utils/units.utils.js";
import type { ReplaceRangeOptions } from "./replace-range.types.js";

/**
 * Replaces the units from `start` to `end` with `replacement`.
 *
 * Negative indexes count from the end. `start` after `end`, after that
 * resolution, throws `RangeError`. The input is not changed.
 *
 * @param options - `value`, `start`, `end`, `replacement`, and `unit`.
 * @returns The new string, or `undefined` when `value` is not a string.
 * @throws {@link RangeError} When `start` is after `end`.
 * @example
 * replaceRange({ value: "abcd", start: 1, end: 3, replacement: "X" });
 */
export function replaceRange(options: ReplaceRangeOptions): string | undefined {
    const resolved = readOptionsCall(options, (record) => ({
        start: readInteger(
            "start",
            record.start,
            Number.MIN_SAFE_INTEGER,
            Number.MAX_SAFE_INTEGER,
        ),
        end: readInteger(
            "end",
            record.end,
            Number.MIN_SAFE_INTEGER,
            Number.MAX_SAFE_INTEGER,
        ),
        replacement: readRequiredString("replacement", record.replacement),
        unit: readUnit(record.unit),
    }));
    if (resolved === undefined || typeof resolved.record.value !== "string")
        return undefined;
    const units = splitIntoUnits(resolved.record.value, resolved.options.unit);
    const start = clampIndex(resolved.options.start, units.length);
    const end = clampIndex(resolved.options.end, units.length);
    if (start > end)
        throw new RangeError(
            `start must not be after end. Received start ${start} and end ${end}.`,
        );
    return (
        units.slice(0, start).join("") +
        resolved.options.replacement +
        units.slice(end).join("")
    );
}
