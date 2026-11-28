import { padToLength, readPadCall } from "../utils/shape.utils.js";
import type { PadOptions } from "./pad.types.js";

/**
 * Pads `value` out to `maximumLength` units.
 *
 * The default alignment is center. A string that is already long enough is
 * returned unchanged. The input is not changed.
 *
 * @param options - `value`, `maximumLength`, `padString`, `align`, and `unit`.
 * @returns The padded string, or `undefined` when `value` is not a string.
 * @throws {@link RangeError} When `maximumLength` is negative or not an integer, `align` is unknown, or `padString` is empty.
 * @example
 * pad({ value: "a", maximumLength: 3 });
 */
export function pad(options: PadOptions): string | undefined {
    const resolved = readPadCall(options, "center");
    if (resolved === undefined) {
        return undefined;
    }
    return padToLength(
        resolved.value,
        resolved.maximumLength,
        resolved.padString,
        resolved.align,
        resolved.unit,
    );
}
