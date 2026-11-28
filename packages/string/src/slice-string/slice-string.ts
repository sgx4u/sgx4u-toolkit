import { readInteger } from "../utils/assertions.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import { readUnit, sliceUnits, splitIntoUnits } from "../utils/units.utils.js";
import type { SliceStringOptions } from "./slice-string.types.js";

/**
 * Returns a slice of `value` in the chosen unit.
 *
 * Indexes work like `String.prototype.slice`, including negative indexes.
 * The result may be empty. The input is not changed.
 *
 * @param options - `value`, `start`, `end`, and `unit`.
 * @returns The slice, or `undefined` when `value` is not a string.
 * @throws {@link RangeError} When an index is not an integer or `unit` is unknown.
 * @example
 * sliceString({ value: "hello", start: 1, end: 4 });
 */
export function sliceString(options: SliceStringOptions): string | undefined {
    const resolved = readOptionsCall(options, (record) => ({
        start: readInteger(
            "start",
            record.start,
            Number.MIN_SAFE_INTEGER,
            Number.MAX_SAFE_INTEGER,
            0,
        ),
        end:
            record.end === undefined
                ? undefined
                : readInteger(
                      "end",
                      record.end,
                      Number.MIN_SAFE_INTEGER,
                      Number.MAX_SAFE_INTEGER,
                  ),
        unit: readUnit(record.unit),
    }));
    if (resolved === undefined || typeof resolved.record.value !== "string") {
        return undefined;
    }
    return sliceUnits(
        splitIntoUnits(resolved.record.value, resolved.options.unit),
        resolved.options.start,
        resolved.options.end,
    );
}
