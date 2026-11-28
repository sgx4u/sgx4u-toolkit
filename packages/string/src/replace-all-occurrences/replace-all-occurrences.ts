import { readRequiredString } from "../utils/assertions.utils.js";
import { describeReceived } from "../utils/describe-received.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import type { ReplaceAllOccurrencesOptions } from "./replace-all-occurrences.types.js";

/**
 * Replaces every match of `pattern` with `replacement`.
 *
 * A string pattern is literal, including `$`. A `RegExp` is copied with the
 * global flag so the caller's `lastIndex` is not left changed. The input is not changed.
 *
 * @param options - `value`, `pattern`, and `replacement`.
 * @returns The new string, or `undefined` when `value` is not a string.
 * @throws {@link TypeError} When `pattern` is neither a string nor a `RegExp`.
 * @example
 * replaceAllOccurrences({ value: "a-a", pattern: "-", replacement: "_" });
 */
export function replaceAllOccurrences(
    options: ReplaceAllOccurrencesOptions,
): string | undefined {
    const resolved = readOptionsCall(options, (record) => ({
        pattern: readPattern(record.pattern),
        replacement: readRequiredString("replacement", record.replacement),
    }));
    if (resolved === undefined || typeof resolved.record.value !== "string") {
        return undefined;
    }
    const pattern = resolved.options.pattern;
    const value = resolved.record.value;
    if (typeof pattern === "string") {
        if (pattern.length === 0) {
            return value;
        }
        return value.split(pattern).join(resolved.options.replacement);
    }
    const flags = pattern.flags.includes("g")
        ? pattern.flags
        : `${pattern.flags}g`;
    const copy = new RegExp(pattern.source, flags);
    return value.replace(copy, () => resolved.options.replacement);
}

/**
 * Reads a string or `RegExp` pattern.
 *
 * An empty string is kept. The caller decides that it matches nothing.
 *
 * @param value - The option value.
 * @returns The pattern.
 * @throws {@link TypeError} When `value` is neither a string nor a `RegExp`.
 */
function readPattern(value: unknown): string | RegExp {
    if (typeof value === "string" || value instanceof RegExp) {
        return value;
    }
    throw new TypeError(
        `pattern must be a string or a RegExp. Received ${describeReceived(value)}.`,
    );
}
