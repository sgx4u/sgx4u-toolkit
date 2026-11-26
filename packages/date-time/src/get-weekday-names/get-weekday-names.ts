import { rangeError } from "../utils/error.utils.js";
import { resolveWeekStartsOn } from "../utils/time-zone.utils.js";
import type { WeekdayNameOptions } from "./get-weekday-names.types.js";

/**
 * Fields for {@link getWeekdayNames}.
 */
export interface GetWeekdayNamesParams extends WeekdayNameOptions {}

/**
 * Returns the 7 weekday names, starting on `startsOn`.
 *
 * The names come from `Intl` for a fixed UTC week, so the result does not
 * depend on the system zone. Monday 3 January 2000 is the reference Monday.
 *
 * @param params - `width` defaults to `"long"` and `startsOn` to Monday.
 * @returns Seven names.
 * @throws {@link RangeError} When `width` or `startsOn` is invalid.
 * @example
 * getWeekdayNames({ locale: "en-US" })[0]; // "Monday"
 */
export function getWeekdayNames(params: GetWeekdayNamesParams = {}): string[] {
    const width = params.width ?? "long";
    if (width !== "long" && width !== "short" && width !== "narrow") {
        throw rangeError("width", `"long", "short", or "narrow"`, width);
    }
    const startsOn = resolveWeekStartsOn(params.startsOn);
    const names: string[] = [];
    for (let offset = 0; offset < 7; offset += 1) {
        const day = 3 + ((startsOn - 1 + offset) % 7);
        const date = new Date(Date.UTC(2000, 0, day));
        names.push(
            new Intl.DateTimeFormat(params.locale, {
                weekday: width,
                timeZone: "UTC",
            }).format(date),
        );
    }
    return names;
}