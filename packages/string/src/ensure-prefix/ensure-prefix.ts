import { readRequiredString } from "../utils/assertions.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import type { EnsurePrefixOptions } from "./ensure-prefix.types.js";

/**
 * Returns `value` with `prefix` applied once.
 *
 * The input is not changed.
 *
 * @param options - `value` and `prefix`.
 * @returns The new string, or `undefined` when `value` is not a string.
 * @throws {@link TypeError} When `prefix` is not a string.
 * @example
 * ensurePrefix({ value: "hello", prefix: "x" });
 */
export function ensurePrefix(options: EnsurePrefixOptions): string | undefined {
    const resolved = readOptionsCall(options, (record) => ({
        affix: readRequiredString("prefix", record.prefix),
    }));
    if (resolved === undefined || typeof resolved.record.value !== "string")
        return undefined;
    const value = resolved.record.value;
    const affix = resolved.options.affix;
    return value.startsWith(affix) ? value : affix + value;
}
