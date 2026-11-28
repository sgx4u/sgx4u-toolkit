import {
    readOptionalString,
    readRequiredString,
} from "../utils/assertions.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import type { SurroundOptions } from "./surround.types.js";

/**
 * Wraps `value` with `prefix` and `suffix`.
 *
 * `suffix` defaults to `prefix`. The input is not changed.
 *
 * @param options - `value`, `prefix`, and an optional `suffix`.
 * @returns The wrapped string, or `undefined` when `value` is not a string.
 * @throws {@link TypeError} When `prefix` or `suffix` is not a string.
 * @example
 * surround({ value: "a", prefix: "*" });
 */
export function surround(options: SurroundOptions): string | undefined {
    const resolved = readOptionsCall(options, (record) => ({
        prefix: readRequiredString("prefix", record.prefix),
        suffix: readOptionalString("suffix", record.suffix),
    }));
    if (resolved === undefined || typeof resolved.record.value !== "string")
        return undefined;
    const suffix = resolved.options.suffix ?? resolved.options.prefix;
    return resolved.options.prefix + resolved.record.value + suffix;
}
