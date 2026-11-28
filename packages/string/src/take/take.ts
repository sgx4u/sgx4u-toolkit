import { readInteger } from "../utils/assertions.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import { readUnit, splitIntoUnits } from "../utils/units.utils.js";
import type { TakeOptions } from "./take.types.js";

/**
 * Returns part of `value` measured in `unit`.
 *
 * `count` of 0 returns an empty string. The input is not changed.
 *
 * @param options - `value`, `count`, and `unit`.
 * @returns The new string, or `undefined` when `value` is not a string.
 * @throws {@link RangeError} When `count` is negative or not an integer.
 * @example
 * take({ value: "hello", count: 2 });
 */
export function take(options: TakeOptions): string | undefined {
    const resolved = readOptionsCall(options, (record) => ({
        count: readInteger("count", record.count, 0, undefined),
        unit: readUnit(record.unit),
    }));
    if (resolved === undefined || typeof resolved.record.value !== "string") {
        return undefined;
    }
    const units = splitIntoUnits(resolved.record.value, resolved.options.unit);
    const count = resolved.options.count;
    return units.slice(0, Math.max(0, count)).join("");
}
