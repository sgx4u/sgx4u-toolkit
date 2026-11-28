import type { HolidayRule } from "../../types/holiday.types.js";
import type { CalendarDate } from "../../types/time.types.js";

/**
 * A published calendar date used by a year table.
 *
 * @param year - The Gregorian year.
 * @param month - The month, from 1.
 * @param day - The day.
 * @returns The calendar date.
 */
function published(year: number, month: number, day: number): CalendarDate {
    return { year, month, day };
}

/**
 * Holi (Dhulandi) for Central Government offices.
 *
 * 2025 is the ESIC Delhi list. 2026 is the Ministry of Parliamentary Affairs
 * calendar. 2027 is DoPT F. No. 12/2/2023-JCA. 2028–2030 are expected New
 * Delhi dates and can move when the gazette is published.
 */
const holi: Readonly<Record<number, CalendarDate>> = {
    2025: published(2025, 3, 14),
    2026: published(2026, 3, 4),
    2027: published(2027, 3, 23),
    2028: published(2028, 3, 11),
    2029: published(2029, 3, 1),
    2030: published(2030, 3, 20),
};

/**
 * Diwali (Deepavali) for Central Government offices in Delhi.
 *
 * 2027 is 29 October in the DoPT office memorandum. 2028–2030 are expected.
 */
const diwali: Readonly<Record<number, CalendarDate>> = {
    2025: published(2025, 10, 20),
    2026: published(2026, 11, 8),
    2027: published(2027, 10, 29),
    2028: published(2028, 10, 17),
    2029: published(2029, 11, 5),
    2030: published(2030, 10, 26),
};

/**
 * Id-ul-Fitr. 2028–2030 follow the expected moon and can change.
 */
const eidAlFitr: Readonly<Record<number, CalendarDate>> = {
    2025: published(2025, 3, 31),
    2026: published(2026, 3, 21),
    2027: published(2027, 3, 10),
    2028: published(2028, 2, 27),
    2029: published(2029, 2, 15),
    2030: published(2030, 2, 5),
};

/**
 * Id-ul-Zuha (Eid al-Adha). 2028–2030 are expected.
 */
const eidAlAdha: Readonly<Record<number, CalendarDate>> = {
    2025: published(2025, 6, 7),
    2026: published(2026, 5, 27),
    2027: published(2027, 5, 17),
    2028: published(2028, 5, 6),
    2029: published(2029, 4, 25),
    2030: published(2030, 4, 14),
};

/**
 * National holidays of India.
 *
 * Republic Day, Independence Day, and Gandhi Jayanti are fixed public
 * holidays. Good Friday and Christmas follow the calendar. Holi, Diwali,
 * Eid al-Fitr, and Eid al-Adha use the Central Government dates for 2025
 * through 2027 (ESIC Delhi 2025, Ministry of Parliamentary Affairs 2026,
 * and DoPT office memorandum F. No. 12/2/2023-JCA for 2027). Years 2028
 * through 2030 are expected dates for New Delhi and are replaced when the
 * gazette for that year is published. A year missing from a table produces
 * no holiday.
 */
export const indiaHolidayRules: readonly HolidayRule[] = [
    { name: "Republic Day", date: { kind: "fixed", month: 1, day: 26 } },
    { name: "Holi", date: { kind: "year-table", dates: holi } },
    { name: "Eid al-Fitr", date: { kind: "year-table", dates: eidAlFitr } },
    { name: "Good Friday", date: { kind: "easter-offset", days: -2 } },
    { name: "Eid al-Adha", date: { kind: "year-table", dates: eidAlAdha } },
    { name: "Independence Day", date: { kind: "fixed", month: 8, day: 15 } },
    { name: "Gandhi Jayanti", date: { kind: "fixed", month: 10, day: 2 } },
    { name: "Diwali", date: { kind: "year-table", dates: diwali } },
    { name: "Christmas", date: { kind: "fixed", month: 12, day: 25 } },
];
