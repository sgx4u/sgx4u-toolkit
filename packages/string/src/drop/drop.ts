import { readInteger } from "../utils/assertions.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import { readUnit, splitIntoUnits } from "../utils/units.utils.js";
import type { DropOptions } from "./drop.types.js";

/**
 * Returns part of `value` measured in `unit`.
 *
 * `count` of 0 returns an empty string. The input is not changed.
 *
 * @param options - `value`, `count`, and `unit`.
 * @returns The new string, or `undefined` when `value` is not a string.
 * @throws {@link RangeError} When `count` is negative or not an integer.
 * @example
 * drop({ value: "hello", count: 2 });
 */
export function drop(options: DropOptions): string | undefined {
    const resolved = readOptionsCall(options, (record) => ({
        count: readInteger("count", record.count, 0, undefined),
        unit: readUnit(record.unit),
    }));
    if (resolved === undefined || typeof resolved.record.value !== "string") {
        return undefined;
    }
    if (resolved.options.count === 0) {
        return "";
    }
    const units = splitIntoUnits(resolved.record.value, resolved.options.unit);
    return units.slice(resolved.options.count).join("");
}
