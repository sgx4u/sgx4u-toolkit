import type { LocaleWeekInfo } from "../types/calendar-grid.types.js";
import { localeWeekInfo } from "../utils/week.utils.js";

/**
 * Returns the week rules `Intl` reports for a locale.
 *
 * When the runtime has no week data, the result is the ISO default:
 * Monday, weekend Saturday and Sunday, and four days in the first week.
 *
 * @param locale - A BCP 47 tag. Omit it to use the runtime locale.
 * @returns The first day, weekend days, and minimum length of week 1.
 * @example
 * getLocaleWeekInfo("en-US").firstDay; // 7
 */
export function getLocaleWeekInfo(locale?: string): LocaleWeekInfo {
    return localeWeekInfo(locale);
}
