import { readInteger, readRequiredString } from "../utils/assertions.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import { clampIndex, readUnit, splitIntoUnits } from "../utils/units.utils.js";
import type { InsertStringOptions } from "./insert-string.types.js";

/**
 * Inserts `insertion` at `index` in the chosen unit.
 *
 * An index equal to the length appends. Out-of-range indexes are clamped
 * like `slice`. The input is not changed.
 *
 * @param options - `value`, `index`, `insertion`, and `unit`.
 * @returns The new string, or `undefined` when `value` is not a string.
 * @throws {@link RangeError} When `index` is not an integer.
 * @example
 * insertString({ value: "ac", index: 1, insertion: "b" });
 */
export function insertString(options: InsertStringOptions): string | undefined {
    const resolved = readOptionsCall(options, (record) => ({
        index: readInteger(
            "index",
            record.index,
            Number.MIN_SAFE_INTEGER,
            Number.MAX_SAFE_INTEGER,
        ),
        insertion: readRequiredString("insertion", record.insertion),
        unit: readUnit(record.unit),
    }));
    if (resolved === undefined || typeof resolved.record.value !== "string")
        return undefined;
    const units = splitIntoUnits(resolved.record.value, resolved.options.unit);
    const index = clampIndex(resolved.options.index, units.length);
    return (
        units.slice(0, index).join("") +
        resolved.options.insertion +
        units.slice(index).join("")
    );
}
