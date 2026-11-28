import { padToLength, readPadCall } from "../utils/shape.utils.js";
import type { PadEndOptions } from "./pad-end.types.js";

/**
 * Pads `value` on the right until it reaches `maximumLength` units.
 *
 * A string that is already long enough is returned unchanged. The input is not changed.
 *
 * @param options - `value`, `maximumLength`, `padString`, and `unit`.
 * @returns The padded string, or `undefined` when `value` is not a string.
 * @throws {@link RangeError} When `maximumLength` is negative or not an integer.
 * @example
 * padEnd({ value: "a", maximumLength: 3 });
 */
export function padEnd(options: PadEndOptions): string | undefined {
    const resolved = readPadCall(options, undefined);
    if (resolved === undefined) {
        return undefined;
    }
    return padToLength(
        resolved.value,
        resolved.maximumLength,
        resolved.padString,
        "end",
        resolved.unit,
    );
}
