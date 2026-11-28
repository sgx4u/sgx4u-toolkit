import { readEnum, readRequiredString } from "../utils/assertions.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import type { GetSubstringAfterOptions } from "./get-substring-after.types.js";

/**
 * Returns the text around `separator`.
 *
 * `missing: "empty"` returns `""` when the separator is absent.
 * `missing: "whole"` returns `value`. The input is not changed.
 *
 * @param options - `value`, `separator`, and `missing`.
 * @returns The piece, or `undefined` when `value` is not a string.
 * @throws {@link TypeError} When `separator` is not a string.
 * @throws {@link RangeError} When `missing` is not `"empty"` or `"whole"`.
 * @example
 * getSubstringAfter({ value: "a-b", separator: "-" });
 */
export function getSubstringAfter(
    options: GetSubstringAfterOptions,
): string | undefined {
    const resolved = readOptionsCall(options, (record) => ({
        separator: readRequiredString("separator", record.separator),
        missing: readEnum(
            "missing",
            record.missing,
            ["empty", "whole"] as const,
            "empty",
        ),
    }));
    if (resolved === undefined || typeof resolved.record.value !== "string")
        return undefined;
    const value = resolved.record.value;
    const separator = resolved.options.separator;
    const index = value.indexOf(separator);
    const missing = resolved.options.missing === "whole" ? value : "";
    return index === -1 ? missing : value.slice(index + separator.length);
}
