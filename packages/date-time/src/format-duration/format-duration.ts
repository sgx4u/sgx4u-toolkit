import { durationFieldNames, readDuration } from "../utils/duration.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { formatClockText } from "../utils/duration-text.utils.js";
import type { FormatDurationParams } from "./format-duration.types.js";

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
 * @param params - `duration` is required. `style` defaults to `"long"`.
 * @returns The localized text, or `undefined` when `duration` is not usable.
 * @throws {@link RangeError} When `style` is invalid.
 * @example
 * formatDuration({ duration: { hours: 1, minutes: 30 }, locale: "en" }); // "1 hour, 30 minutes"
 */
export function formatDuration({
    duration,
    style = "long",
    locale,
}: FormatDurationParams): string | undefined {
    const checked = readDuration(duration);
    if (checked === undefined) {
        return undefined;
    }
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
    const DurationFormat = (
        Intl as unknown as {
            DurationFormat?: new (
                locales?: string | readonly string[],
                formatOptions?: { style?: string },
            ) => { format: (value: typeof checked) => string };
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
