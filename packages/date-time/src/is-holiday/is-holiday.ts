import type { ConfiguredHoliday } from "../types/configured-holiday.types.js";
import type { DateInput } from "../types/date-input.types.js";
import { readDateInput } from "../utils/date-input.utils.js";
import { isDateValue } from "../utils/date-value.utils.js";
import { typeError } from "../utils/error.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";

/**
 * Fields for {@link isHoliday}.
 */
export interface IsHolidayParams {
    /**
     * The date to test.
     */
    date: DateInput;
    /**
     * Holidays to match. A bare date has no name. Omit it for none.
     *
     * @defaultValue `[]`
     */
    holidays?: readonly (ConfiguredHoliday | DateInput)[];
    /**
     * Zone used to read the calendar day.
     *
     * @defaultValue The system time zone.
     */
    timeZone?: string;
    /**
     * When `true`, the result is `{ isHoliday, name? }` instead of a boolean.
     *
     * @defaultValue `false`
     */
    includeName?: boolean;
}

/**
 * A holiday check that also carries the matched name.
 */
export interface HolidayCheck {
    /**
     * Whether the calendar day is in `holidays`.
     */
    isHoliday: boolean;
    /**
     * The first matched holiday's name, when it has one.
     */
    name?: string;
}

/**
 * Reports whether a date is one of the given holidays.
 *
 * Matching uses the calendar day in `timeZone`. A date-only holiday string
 * is that day in the same zone. The first match wins.
 *
 * @param params - `date` is required. `holidays` defaults to none. Set `includeName` to receive the name.
 * @returns `false` when the day is not a holiday or `date` is not a real date. With `includeName: true`, `{ isHoliday, name? }`.
 * @throws {@link TypeError} When `holidays` is not an array.
 * @throws {@link RangeError} When `timeZone` is not a usable zone.
 * @example
 * isHoliday({ date: "2026-01-26", holidays: [{ date: "2026-01-26", name: "Republic Day" }], timeZone: "Asia/Kolkata" }); // true
 */
export function isHoliday(
    params: IsHolidayParams & { includeName: true },
): HolidayCheck;
export function isHoliday(
    params: IsHolidayParams & { includeName?: false },
): boolean;
export function isHoliday(params: IsHolidayParams): boolean | HolidayCheck {
    const zone = resolveTimeZone(params.timeZone);
    if (params.holidays !== undefined && !Array.isArray(params.holidays)) {
        throw typeError(
            "holidays",
            "an array of { date, name? }",
            params.holidays,
        );
    }
    const resolved = readDateInput(params.date, zone);
    const match =
        resolved === undefined
            ? undefined
            : findHoliday(params.holidays ?? [], resolved, zone);
    if (params.includeName === true) {
        if (match?.name === undefined) {
            return { isHoliday: match !== undefined };
        }
        return { isHoliday: true, name: match.name };
    }
    return match !== undefined;
}

/**
 * @param holidays - The list to search.
 * @param date - A real date.
 * @param timeZone - The zone both days are read in.
 * @returns The first holiday on that calendar day.
 */
function findHoliday(
    holidays: readonly (ConfiguredHoliday | DateInput)[],
    date: Date,
    timeZone: string,
): ConfiguredHoliday | undefined {
    const parts = readDateParts(date.getTime(), timeZone);
    for (const holiday of holidays) {
        const entry = holidayEntry(holiday);
        const holidayDate = readDateInput(entry.date, timeZone);
        if (holidayDate === undefined) {
            continue;
        }
        const holidayParts = readDateParts(holidayDate.getTime(), timeZone);
        if (
            holidayParts.year === parts.year &&
            holidayParts.month === parts.month &&
            holidayParts.day === parts.day
        ) {
            return entry;
        }
    }
    return undefined;
}

/**
 * @param holiday - A `{ date, name? }` entry or a bare date.
 * @returns The entry used for matching.
 */
function holidayEntry(
    holiday: ConfiguredHoliday | DateInput,
): ConfiguredHoliday {
    if (
        isDateValue(holiday) ||
        typeof holiday === "string" ||
        typeof holiday === "number"
    ) {
        return { date: holiday };
    }
    return holiday;
}
