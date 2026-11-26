import { rangeError } from "../utils/error.utils.js";
import type { FormatTimeOfDayParams } from "./format-time-of-day.types.js";

/**
 * Formats a time of day in a locale.
 *
 * @param params - `time` is required. `precision` defaults to `"minute"`.
 * @returns Locale clock text, or `undefined` when `time` is not usable.
 * @throws {@link RangeError} When the precision or hour cycle is unknown.
 * @example
 * formatTimeOfDay({
 *   time: { hour: 15, minute: 30, second: 0, millisecond: 0 },
 *   locale: "en-US",
 *   hourCycle: "h23",
 * }); // "15:30"
 */
export function formatTimeOfDay({
    time,
    locale,
    precision = "minute",
    hourCycle,
}: FormatTimeOfDayParams): string | undefined {
    if (
        typeof time !== "object" ||
        time === null ||
        !Number.isFinite(time.hour) ||
        !Number.isFinite(time.minute) ||
        !Number.isFinite(time.second) ||
        !Number.isFinite(time.millisecond)
    ) {
        return undefined;
    }
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
    if (hourCycle !== undefined && hourCycle !== "h12" && hourCycle !== "h23") {
        throw rangeError("hourCycle", `"h12" or "h23"`, hourCycle);
    }
    const instant = new Date(
        Date.UTC(
            2020,
            0,
            1,
            time.hour,
            time.minute,
            time.second,
            time.millisecond,
        ),
    );
    return new Intl.DateTimeFormat(locale, {
        timeZone: "UTC",
        hour: "numeric",
        minute: "2-digit",
        ...(precision !== "minute" ? { second: "2-digit" as const } : {}),
        ...(precision === "millisecond"
            ? { fractionalSecondDigits: 3 as const }
            : {}),
        ...(hourCycle !== undefined ? { hourCycle } : {}),
    }).format(instant);
}
