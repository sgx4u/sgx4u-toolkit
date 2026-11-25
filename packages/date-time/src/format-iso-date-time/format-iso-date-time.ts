import type { DateInput } from "../types/date-input.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { formatCalendarText, formatOffsetText } from "../utils/iso.utils.js";
import {
    parseFixedOffsetMinutes,
    readDateParts,
    resolveTimeZone,
} from "../utils/time-zone.utils.js";
import type { FormatIsoDateTimeOptions } from "./format-iso-date-time.types.js";

/**
 * Formats an instant as an ISO date-time with a numeric offset.
 *
 * The offset is `Z` only when `timeZone` is `"UTC"`. A fixed offset is
 * written as `±HH:mm`. `includeTimeZoneName` appends `[zone]` for an IANA
 * name only.
 *
 * @param date - The instant to format.
 * @param options - `precision` defaults to `"millisecond"`.
 * @returns The ISO text.
 * @throws {@link RangeError} When `date`, the zone, or `precision` is invalid.
 * @example
 * formatIsoDateTime("2026-11-25T22:00:00.000Z", { timeZone: "Asia/Kolkata", precision: "minute" }); // "2026-11-26T03:30+05:30"
 */
export function formatIsoDateTime(
    date: DateInput,
    options?: FormatIsoDateTimeOptions,
): string {
    const precision = options?.precision ?? "millisecond";
    if (
        precision !== "minute" &&
        precision !== "second" &&
        precision !== "millisecond"
    ) {
        throw rangeError(
            "precision",
            `"minute", "second", or "millisecond"`,
            precision,
        );
    }
    const timeZone = resolveTimeZone(options?.timeZone);
    const parts = readDateParts(
        resolveDateInput(date, "date").getTime(),
        timeZone,
    );
    let text = `${formatCalendarText(parts.year, parts.month, parts.day)}T${pad(parts.hour)}:${pad(parts.minute)}`;
    if (precision !== "minute") {
        text += `:${pad(parts.second)}`;
    }
    if (precision === "millisecond") {
        text += `.${String(parts.millisecond).padStart(3, "0")}`;
    }
    text += formatOffsetText(parts.offsetMinutes, timeZone === "UTC");
    if (
        options?.includeTimeZoneName === true &&
        parseFixedOffsetMinutes(timeZone) === undefined
    ) {
        text += `[${timeZone}]`;
    }
    return text;
}

/**
 * @param value - A number from 0 through 59.
 * @returns Two digits.
 */
function pad(value: number): string {
    return String(value).padStart(2, "0");
}
