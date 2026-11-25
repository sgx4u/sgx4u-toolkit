import type { TimeOfDay } from "../types/time.types.js";
import { rangeError, typeError } from "../utils/error.utils.js";
import type { FormatTimeOfDayOptions } from "./format-time-of-day.types.js";

/**
 * Formats a time of day in a locale.
 *
 * @param time - The time to format.
 * @param options - `precision` defaults to `"minute"`.
 * @returns Locale clock text.
 * @throws {@link RangeError} When the precision or hour cycle is unknown.
 * @example
 * formatTimeOfDay({ hour: 15, minute: 30, second: 0, millisecond: 0 }, { locale: "en-US", hourCycle: "h23" }); // "15:30"
 */
export function formatTimeOfDay(
    time: TimeOfDay,
    options?: FormatTimeOfDayOptions,
): string {
    if (
        typeof time !== "object" ||
        time === null ||
        !Number.isFinite(time.hour)
    ) {
        throw typeError("time", "a time of day", time);
    }
    const precision = options?.precision ?? "minute";
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
    return new Intl.DateTimeFormat(options?.locale, {
        timeZone: "UTC",
        hour: "numeric",
        minute: "2-digit",
        ...(precision !== "minute" ? { second: "2-digit" as const } : {}),
        ...(precision === "millisecond"
            ? { fractionalSecondDigits: 3 as const }
            : {}),
        ...(options?.hourCycle !== undefined
            ? { hourCycle: options.hourCycle }
            : {}),
    }).format(instant);
}
