import type { DateInput } from "../types/date-input.types.js";
import type { Season } from "../types/astronomy.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";
import type { GetSeasonOptions } from "./get-season.types.js";

const northern: readonly Season[] = [
    "winter",
    "winter",
    "spring",
    "spring",
    "spring",
    "summer",
    "summer",
    "summer",
    "autumn",
    "autumn",
    "autumn",
    "winter",
];

/**
 * Returns the season for a date.
 *
 * Meteorological seasons in the northern hemisphere are spring in March
 * through May, summer in June through August, autumn in September through
 * November, and winter in December through February. The southern
 * hemisphere shifts those by six months.
 *
 * @param date - The date to classify.
 * @param options - `hemisphere` defaults to `"northern"` and `method` to `"meteorological"`.
 * @returns The season.
 * @throws {@link RangeError} When `date` or an option is invalid.
 * @example
 * getSeason("2026-07-01T00:00:00Z", { timeZone: "UTC" }); // "summer"
 */
export function getSeason(date: DateInput, options?: GetSeasonOptions): Season {
    const hemisphere = options?.hemisphere ?? "northern";
    const method = options?.method ?? "meteorological";
    if (hemisphere !== "northern" && hemisphere !== "southern") {
        throw rangeError("hemisphere", `"northern" or "southern"`, hemisphere);
    }
    if (method !== "meteorological" && method !== "astronomical") {
        throw rangeError(
            "method",
            `"meteorological" or "astronomical"`,
            method,
        );
    }
    const timeZone = resolveTimeZone(options?.timeZone);
    const parts = readDateParts(
        resolveDateInput(date, "date", timeZone).getTime(),
        timeZone,
    );
    const month =
        hemisphere === "southern" ? ((parts.month + 5) % 12) + 1 : parts.month;
    if (method === "astronomical") {
        return astronomicalSeason(
            parts.year,
            parts.month,
            parts.day,
            hemisphere,
        );
    }
    return northern[month - 1] ?? "winter";
}

/**
 * A mean-orbit approximation of the equinoxes and solstices, accurate to
 * about a day. The southern hemisphere swaps the names.
 *
 * @param year - The calendar year.
 * @param month - The month.
 * @param day - The day.
 * @param hemisphere - Which names to use.
 * @returns The season that contains that calendar day.
 */
function astronomicalSeason(
    year: number,
    month: number,
    day: number,
    hemisphere: "northern" | "southern",
): Season {
    const dayOfYear = monthDayNumber(month, day);
    const northernSeason = seasonFromDay(dayOfYear);
    if (hemisphere === "northern") {
        return northernSeason;
    }
    const swapped: Record<Season, Season> = {
        spring: "autumn",
        summer: "winter",
        autumn: "spring",
        winter: "summer",
    };
    return swapped[northernSeason];
}

/**
 * Approximate northern boundaries: March 20, June 21, September 22, December 21.
 *
 * @param dayOfYear - The day of a non-leap-adjusted year, close enough for a one-day approximation.
 * @returns The northern season.
 */
function seasonFromDay(dayOfYear: number): Season {
    if (dayOfYear >= 355 || dayOfYear < 79) {
        return "winter";
    }
    if (dayOfYear < 172) {
        return "spring";
    }
    if (dayOfYear < 265) {
        return "summer";
    }
    return "autumn";
}

/**
 * @param month - Month from 1 through 12.
 * @param day - Day of the month.
 * @returns A day count using a 365-day layout, which is enough for the day-level approximation.
 */
function monthDayNumber(month: number, day: number): number {
    const lengths = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let total = day;
    for (let index = 1; index < month; index += 1) {
        total += lengths[index] ?? 0;
    }
    return total;
}
