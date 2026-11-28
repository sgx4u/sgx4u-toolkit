import { readInteger } from "../utils/assertions.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import type { RepeatStringOptions } from "./repeat-string.types.js";

/**
 * Repeats `value` `count` times.
 *
 * A count of 0 returns an empty string. The input is not changed.
 *
 * @param options - `value` and `count`.
 * @returns The repeated string, or `undefined` when `value` is not a string.
 * @throws {@link RangeError} When `count` is negative or not an integer.
 * @example
 * repeatString({ value: "ab", count: 2 });
 */
export function repeatString(options: RepeatStringOptions): string | undefined {
    const resolved = readOptionsCall(options, (record) => ({
        count: readInteger("count", record.count, 0, undefined),
    }));
    if (resolved === undefined || typeof resolved.record.value !== "string")
        return undefined;
    return resolved.record.value.repeat(resolved.options.count);
}
