import { rangeError } from "../utils/error.utils.js";
import type { LocaleDatePatternOptions } from "./get-locale-date-pattern.types.js";

/**
 * Returns the locale's numeric date pattern, such as `dd/MM/yyyy`.
 *
 * The pattern is built from `formatToParts` of a fixed UTC reference date.
 * Day, month, and year parts become `dd`, `MM`, and `yyyy`. Other parts
 * are copied as separators.
 *
 * @param options - `style` defaults to `"short"`.
 * @returns A CLDR-style numeric pattern.
 * @throws {@link RangeError} When `style` is not `"short"` or `"medium"`.
 * @example
 * getLocaleDatePattern({ locale: "en-US" }); // "MM/dd/yyyy" or the runtime's numeric order
 */
export function getLocaleDatePattern(
    options?: LocaleDatePatternOptions,
): string {
    const style = options?.style ?? "short";
    if (style !== "short" && style !== "medium") {
        throw rangeError("style", `"short" or "medium"`, style);
    }
    const parts = new Intl.DateTimeFormat(options?.locale, {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date(Date.UTC(2000, 10, 26)));
    let pattern = "";
    for (const part of parts) {
        if (part.type === "day") {
            pattern += "dd";
        } else if (part.type === "month") {
            pattern += "MM";
        } else if (part.type === "year") {
            pattern += "yyyy";
        } else if (part.type === "literal") {
            pattern += part.value;
        }
    }
    return pattern;
}
