import type { Duration } from "../types/duration.types.js";
import { assertDuration, durationFieldNames } from "../utils/duration.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { formatClockText } from "../utils/duration-text.utils.js";
import type { FormatDurationOptions } from "./format-duration.types.js";

const singularUnit: Readonly<Record<string, string>> = {
    years: "year",
    months: "month",
    weeks: "week",
    days: "day",
    hours: "hour",
    minutes: "minute",
    seconds: "second",
    milliseconds: "millisecond",
};

/**
 * Formats a duration as text such as `1 hour, 30 minutes`.
 *
 * Uses `Intl.DurationFormat` when the runtime has it. Otherwise each unit
 * is formatted with `Intl.NumberFormat` and joined with `Intl.ListFormat`.
 * `"digital"` falls back to `formatDurationAsClock` when `DurationFormat`
 * is missing.
 *
 * @param duration - The duration to format.
 * @param options - `style` defaults to `"long"`.
 * @returns The localized text.
 * @throws {@link RangeError} When `duration` or `style` is invalid.
 * @example
 * formatDuration({ hours: 1, minutes: 30 }, { locale: "en" }); // "1 hour, 30 minutes"
 */
export function formatDuration(
    duration: Duration,
    options?: FormatDurationOptions,
): string {
    const checked = assertDuration(duration, "duration");
    const style = options?.style ?? "long";
    if (
        style !== "long" &&
        style !== "short" &&
        style !== "narrow" &&
        style !== "digital"
    ) {
        throw rangeError(
            "style",
            `"long", "short", "narrow", or "digital"`,
            style,
        );
    }
    const locale = options?.locale;
    const DurationFormat = (
        Intl as unknown as {
            DurationFormat?: new (
                locales?: string | readonly string[],
                formatOptions?: { style?: string },
            ) => { format: (value: Duration) => string };
        }
    ).DurationFormat;
    if (DurationFormat !== undefined) {
        try {
            return new DurationFormat(locale, { style }).format(checked);
        } catch {
            if (style === "digital") {
                return formatClockText(checked, true, false);
            }
        }
    }
    if (style === "digital") {
        return formatClockText(checked, true, false);
    }
    const parts: string[] = [];
    for (const fieldName of durationFieldNames) {
        const fieldValue = checked[fieldName];
        if (fieldValue === undefined || fieldValue === 0) {
            continue;
        }
        const unit = singularUnit[fieldName] ?? "second";
        parts.push(
            new Intl.NumberFormat(locale, {
                style: "unit",
                unit,
                unitDisplay: style,
            }).format(fieldValue),
        );
    }
    if (parts.length === 0) {
        return new Intl.NumberFormat(locale, {
            style: "unit",
            unit: "second",
            unitDisplay: style,
        }).format(0);
    }
    return new Intl.ListFormat(locale, { type: "unit", style }).format(parts);
}
