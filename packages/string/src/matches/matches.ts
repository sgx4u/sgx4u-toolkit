import { describeReceived } from "../utils/describe-received.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import type { MatchesOptions } from "./matches.types.js";

/**
 * Reports whether `value` matches `pattern`.
 *
 * A string pattern is a literal substring test. A `RegExp` is tested on a
 * copy, so the caller's `lastIndex` is not changed. A non-string returns
 * `false` and does not throw. The input is not changed.
 *
 * @param options - `value` and `pattern`.
 * @returns `true` when the pattern matches.
 * @throws {@link TypeError} When `pattern` is neither a string nor a `RegExp`.
 * @example
 * matches({ value: "hello", pattern: "ell" });
 */
export function matches(options: MatchesOptions): boolean {
    const resolved = readOptionsCall(options, (record) => ({
        pattern: readPattern(record.pattern),
    }));
    if (resolved === undefined || typeof resolved.record.value !== "string") {
        return false;
    }
    const pattern = resolved.options.pattern;
    if (typeof pattern === "string") {
        return resolved.record.value.includes(pattern);
    }
    const copy = new RegExp(pattern.source, pattern.flags);
    return copy.test(resolved.record.value);
}

/**
 * Reads a string or `RegExp` pattern.
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
