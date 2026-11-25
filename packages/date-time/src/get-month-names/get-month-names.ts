import { rangeError } from "../utils/error.utils.js";
import type { MonthNameOptions } from "./get-month-names.types.js";

/**
 * Returns the 12 month names, January first.
 *
 * The names come from `Intl` for a fixed UTC reference year, so the result
 * does not depend on the system zone.
 *
 * @param options - `width` defaults to `"long"` and `context` to `"standalone"`.
 * @returns Twelve names.
 * @throws {@link RangeError} When `width` is not a known length.
 * @example
 * getMonthNames({ locale: "en-US" })[0]; // "January"
 */
export function getMonthNames(options?: MonthNameOptions): string[] {
    const width = options?.width ?? "long";
    if (width !== "long" && width !== "short" && width !== "narrow") {
        throw rangeError("width", `"long", "short", or "narrow"`, width);
    }
    const names: string[] = [];
    for (let month = 0; month < 12; month += 1) {
        const date = new Date(Date.UTC(2000, month, 15));
        names.push(
            new Intl.DateTimeFormat(options?.locale, {
                month: width,
                timeZone: "UTC",
            }).format(date),
        );
    }
    return names;
}
