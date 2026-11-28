import {
    readEnum,
    readInteger,
    readOptionalString,
} from "../utils/assertions.utils.js";
import { describeReceived } from "../utils/describe-received.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import { trimToSeparator, truncateUnits } from "../utils/shape.utils.js";
import { readUnit, splitIntoUnits } from "../utils/units.utils.js";
import type { TruncateOptions } from "./truncate.types.js";

const locations = ["end", "start", "middle"] as const;

/**
 * Shortens `value` to `maximumLength` units and adds an omission.
 *
 * The cut is always on a unit boundary. When `separator` is set and
 * `location` is `"end"`, the kept text is trimmed back to the last
 * separator. If the omission is longer than `maximumLength`, a unit-sliced
 * omission is returned. The default omission is the ellipsis character.
 * The input is not changed.
 *
 * @param options - `value`, `maximumLength`, and the truncation options.
 * @returns The shortened string, or `undefined` when `value` is not a string.
 * @throws {@link RangeError} When `maximumLength` is negative or not an integer, or `location` or `unit` is unknown.
 * @throws {@link TypeError} When `separator` is neither a string nor a `RegExp`.
 * @example
 * truncate({ value: "hello world", maximumLength: 8 });
 */
export function truncate(options: TruncateOptions): string | undefined {
    const resolved = readOptionsCall(options, (record) => ({
        maximumLength: readInteger(
            "maximumLength",
            record.maximumLength,
            0,
            undefined,
        ),
        omission: readOptionalString("omission", record.omission) ?? "\u2026",
        location: readEnum("location", record.location, locations, "end"),
        unit: readUnit(record.unit),
        separator: readSeparator(record.separator),
    }));
    if (resolved === undefined || typeof resolved.record.value !== "string") {
        return undefined;
    }
    const value = resolved.record.value;
    const units = splitIntoUnits(value, resolved.options.unit);
    const omission = splitIntoUnits(
        resolved.options.omission,
        resolved.options.unit,
    );
    if (
        resolved.options.location === "end" &&
        resolved.options.separator !== undefined &&
        units.length > resolved.options.maximumLength &&
        omission.length < resolved.options.maximumLength
    ) {
        const contentLength = resolved.options.maximumLength - omission.length;
        const trimmed = trimToSeparator(
            units.slice(0, contentLength).join(""),
            resolved.options.separator,
        );
        return trimmed + omission.join("");
    }
    return truncateUnits(
        units,
        resolved.options.maximumLength,
        omission,
        resolved.options.location,
    );
}

/**
 * Reads an optional separator.
 *
 * @param value - The option value.
 * @returns The separator, or `undefined` when it was omitted.
 * @throws {@link TypeError} When `value` is neither a string nor a `RegExp`.
 */
function readSeparator(value: unknown): string | RegExp | undefined {
    if (value === undefined) {
        return undefined;
    }
    if (typeof value === "string" || value instanceof RegExp) {
        return value;
    }
    throw new TypeError(
        `separator must be a string or a RegExp. Received ${describeReceived(value)}.`,
    );
}
