import {
    readEnum,
    readInteger,
    readOptionalString,
} from "../utils/assertions.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import { truncateByWidth } from "../utils/shape.utils.js";
import type { TruncateToDisplayWidthOptions } from "./truncate-to-display-width.types.js";

const locations = ["end", "start", "middle"] as const;

/**
 * Shortens `value` so its display width is at most `maximumWidth`.
 *
 * Width follows `getDisplayWidth`. A grapheme is never split. A grapheme
 * wider than the budget is left off the result. The default omission is
 * the ellipsis. The input is not changed.
 *
 * @param options - `value`, `maximumWidth`, `omission`, and `location`.
 * @returns The shortened string, or `undefined` when `value` is not a string.
 * @throws {@link RangeError} When `maximumWidth` is negative or `location` is unknown.
 * @example
 * truncateToDisplayWidth({ value: "hello", maximumWidth: 4 });
 */
export function truncateToDisplayWidth(
    options: TruncateToDisplayWidthOptions,
): string | undefined {
    const resolved = readOptionsCall(options, (record) => ({
        maximumWidth: readInteger(
            "maximumWidth",
            record.maximumWidth,
            0,
            undefined,
        ),
        omission: readOptionalString("omission", record.omission) ?? "\u2026",
        location: readEnum("location", record.location, locations, "end"),
    }));
    if (resolved === undefined || typeof resolved.record.value !== "string") {
        return undefined;
    }
    return truncateByWidth(
        resolved.record.value,
        resolved.options.maximumWidth,
        resolved.options.omission,
        resolved.options.location,
    );
}
