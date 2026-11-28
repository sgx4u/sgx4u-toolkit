import { readEnum, readRequiredString } from "../utils/assertions.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import type { SplitOnceOptions } from "./split-once.types.js";

/**
 * Splits `value` on the first or last `separator`.
 *
 * The separator is not included in either part. A missing separator returns
 * `undefined`. An empty separator throws, because it would match everywhere.
 * The input is not changed.
 *
 * @param options - `value`, `separator`, and `from`.
 * @returns The two parts, or `undefined` when the separator is missing or `value` is not a string.
 * @throws {@link RangeError} When `separator` is empty or `from` is unknown.
 * @example
 * splitOnce({ value: "a-b-c", separator: "-" });
 */
export function splitOnce(
    options: SplitOnceOptions,
): [string, string] | undefined {
    const resolved = readOptionsCall(options, (record) => {
        const separator = readRequiredString("separator", record.separator);
        if (separator.length === 0) {
            throw new RangeError('separator must not be empty. Received "".');
        }
        return {
            separator,
            from: readEnum(
                "from",
                record.from,
                ["start", "end"] as const,
                "start",
            ),
        };
    });
    if (resolved === undefined || typeof resolved.record.value !== "string") {
        return undefined;
    }
    const value = resolved.record.value;
    const index =
        resolved.options.from === "end"
            ? value.lastIndexOf(resolved.options.separator)
            : value.indexOf(resolved.options.separator);
    if (index === -1) return undefined;
    return [
        value.slice(0, index),
        value.slice(index + resolved.options.separator.length),
    ];
}
