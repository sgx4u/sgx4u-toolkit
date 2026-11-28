import { readRequiredString } from "../utils/assertions.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import type { EnsureSuffixOptions } from "./ensure-suffix.types.js";

/**
 * Returns `value` with `suffix` applied once.
 *
 * The input is not changed.
 *
 * @param options - `value` and `suffix`.
 * @returns The new string, or `undefined` when `value` is not a string.
 * @throws {@link TypeError} When `suffix` is not a string.
 * @example
 * ensureSuffix({ value: "hello", suffix: "x" });
 */
export function ensureSuffix(options: EnsureSuffixOptions): string | undefined {
    const resolved = readOptionsCall(options, (record) => ({
        affix: readRequiredString("suffix", record.suffix),
    }));
    if (resolved === undefined || typeof resolved.record.value !== "string")
        return undefined;
    const value = resolved.record.value;
    const affix = resolved.options.affix;
    return value.endsWith(affix) ? value : value + affix;
}
