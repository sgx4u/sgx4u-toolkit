import { padToLength, readPadCall } from "../utils/shape.utils.js";
import type { PadStartOptions } from "./pad-start.types.js";

/**
 * Pads `value` on the left until it reaches `maximumLength` units.
 *
 * A string that is already long enough is returned unchanged. The input is not changed.
 *
 * @param options - `value`, `maximumLength`, `padString`, and `unit`.
 * @returns The padded string, or `undefined` when `value` is not a string.
 * @throws {@link RangeError} When `maximumLength` is negative or not an integer.
 * @example
 * padStart({ value: "a", maximumLength: 3 });
 */
export function padStart(options: PadStartOptions): string | undefined {
    const resolved = readPadCall(options, undefined);
    if (resolved === undefined) {
        return undefined;
    }
    return padToLength(
        resolved.value,
        resolved.maximumLength,
        resolved.padString,
        "start",
        resolved.unit,
    );
}
