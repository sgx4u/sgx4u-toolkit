import { readInteger, readOptionalString } from "../utils/assertions.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import type { IndentOptions } from "./indent.types.js";

/**
 * Prefixes every non-empty line with `character` repeated `count` times.
 *
 * Empty lines stay empty. The input is not changed.
 *
 * @param options - `value`, `count`, and `character`.
 * @returns The indented string, or `undefined` when `value` is not a string.
 * @throws {@link RangeError} When `count` is negative or not an integer.
 * @example
 * indent({ value: "a\nb" });
 */
export function indent(options: IndentOptions): string | undefined {
    const resolved = readOptionsCall(options, (record) => ({
        count: readInteger("count", record.count, 0, undefined, 1),
        character: readOptionalString("character", record.character) ?? " ",
    }));
    if (resolved === undefined || typeof resolved.record.value !== "string") {
        return undefined;
    }
    const prefix = resolved.options.character.repeat(resolved.options.count);
    return resolved.record.value
        .split("\n")
        .map((line) => (line.length === 0 ? line : prefix + line))
        .join("\n");
}
