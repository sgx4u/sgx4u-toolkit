import { describe, expect, it } from "vitest";
import {
    createHolidayPredicate,
    getHoliday,
    getHolidaysInYear,
    getObservedDate,
    isHoliday,
} from "../index.js";

describe("holiday rules", () => {
    it("observes a Saturday holiday on Friday and finds Good Friday", () => {
        expect(
            getObservedDate({
                date: { year: 2020, month: 7, day: 4 },
                policy: "nearest-weekday",
            }),
        ).toEqual({
            year: 2020,
            month: 7,
            day: 3,
        });
        expect(
            getObservedDate({
                date: { year: 2020, month: 7, day: 4 },
                policy: "next-monday",
            }),
        ).toEqual({
            year: 2020,
            month: 7,
            day: 6,
        });
        const holidays = getHolidaysInYear({
            year: 2026,
            rules: [
                {
                    name: "Good Friday",
                    date: { kind: "easter-offset", days: -2 },
                },
                {
                    name: "Christmas",
                    date: { kind: "fixed", month: 12, day: 25 },
                },
            ],
        });
        expect(holidays?.[0]).toMatchObject({
            name: "Good Friday",
            date: { year: 2026, month: 4, day: 3 },
        });
        expect(
            getHoliday({
                date: "2020-07-03T00:00:00Z",
                rules: [
                    {
                        name: "Independence Day",
                        date: { kind: "fixed", month: 7, day: 4 },
                        observed: "nearest-weekday",
                    },
                ],
                timeZone: "UTC",
            })?.name,
        ).toBe("Independence Day");
        expect(
            isHoliday({
                date: "2026-12-25T00:00:00Z",
                holidays: [{ date: "2026-12-25", name: "Christmas" }],
                timeZone: "UTC",
            }),
        ).toBe(true);
        const predicate = createHolidayPredicate({
            rules: [
                {
                    name: "Republic Day",
                    date: { kind: "fixed", month: 1, day: 26 },
                },
            ],
            timeZone: "Asia/Kolkata",
        });
        expect(predicate(new Date("2026-01-25T18:30:00Z"))).toBe(true);
        expect(
            getHolidaysInYear({
                year: 2024,
                rules: [
                    {
                        name: "Diwali",
                        date: {
                            kind: "year-table",
                            dates: {
                                2025: { year: 2025, month: 10, day: 20 },
                            },
                        },
                    },
                ],
            }),
        ).toEqual([]);
    });
});
