import { readInteger } from "../utils/assertions.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import { readUnit, splitIntoUnits } from "../utils/units.utils.js";
import type { AtStringOptions } from "./at-string.types.js";

/**
 * Returns one unit at `index`.
 *
 * A negative index counts from the end. An out-of-range index returns
 * `undefined`, as does a non-string `value`. The input is not changed.
 *
 * @param options - `value`, `index`, and `unit`.
 * @returns The unit, or `undefined` when it is missing or `value` is not a string.
 * @throws {@link RangeError} When `index` is not an integer.
 * @example
 * atString({ value: "hi", index: 0 });
 */
export function atString(options: AtStringOptions): string | undefined {
    const resolved = readOptionsCall(options, (record) => ({
        index: readInteger(
            "index",
            record.index,
            Number.MIN_SAFE_INTEGER,
            Number.MAX_SAFE_INTEGER,
        ),
        unit: readUnit(record.unit),
    }));
    if (resolved === undefined || typeof resolved.record.value !== "string") {
        return undefined;
    }
    const units = splitIntoUnits(resolved.record.value, resolved.options.unit);
    const index =
        resolved.options.index < 0
            ? units.length + resolved.options.index
            : resolved.options.index;
    return units[index];
}
