import { describe, expect, it } from "vitest";
import { getHoliday } from "../index.js";

const independenceDay = [
    {
        name: "Independence Day",
        date: { kind: "fixed" as const, month: 7, day: 4 },
        observed: "nearest-weekday" as const,
    },
];

describe("getHoliday", () => {
    it("matches the original date and, by default, the observed substitute", () => {
        expect(
            getHoliday("2020-07-04T00:00:00Z", independenceDay, {
                timeZone: "UTC",
            })?.name,
        ).toBe("Independence Day");
        expect(
            getHoliday("2020-07-03T00:00:00Z", independenceDay, {
                timeZone: "UTC",
            }),
        ).toMatchObject({
            name: "Independence Day",
            type: "public",
            date: { year: 2020, month: 7, day: 4 },
            observedDate: { year: 2020, month: 7, day: 3 },
        });
        expect(
            getHoliday("2020-07-03T00:00:00Z", independenceDay, {
                timeZone: "UTC",
                matchObservedDate: false,
            }),
        ).toBeUndefined();
        expect(
            getHoliday("2020-07-05T00:00:00Z", independenceDay, {
                timeZone: "UTC",
            }),
        ).toBeUndefined();
    });

    it("matches a leap day and the New Year on either side of midnight", () => {
        expect(
            getHoliday(
                "2024-02-29T00:00:00Z",
                [
                    {
                        name: "Leap Day",
                        date: { kind: "fixed", month: 2, day: 29 },
                    },
                ],
                { timeZone: "UTC" },
            )?.name,
        ).toBe("Leap Day");
        const newYear = [
            {
                name: "New Year",
                date: { kind: "fixed" as const, month: 1, day: 1 },
            },
        ];
        expect(
            getHoliday("2019-12-31T00:00:00Z", newYear, { timeZone: "UTC" }),
        ).toBeUndefined();
        expect(
            getHoliday("2020-01-01T00:00:00Z", newYear, { timeZone: "UTC" })
                ?.name,
        ).toBe("New Year");
    });

    it("uses the calendar day in New York and Kolkata", () => {
        expect(
            getHoliday("2020-07-04T03:30:00Z", independenceDay, {
                timeZone: "America/New_York",
            })?.name,
        ).toBe("Independence Day");
        expect(
            getHoliday("2020-07-04T03:30:00Z", independenceDay, {
                timeZone: "America/New_York",
                matchObservedDate: false,
            }),
        ).toBeUndefined();
        expect(
            getHoliday("2020-07-03T18:30:00Z", independenceDay, {
                timeZone: "Asia/Kolkata",
            })?.date,
        ).toEqual({ year: 2020, month: 7, day: 4 });
        expect(
            getHoliday("2020-07-03T18:29:00Z", independenceDay, {
                timeZone: "Asia/Kolkata",
            })?.observedDate,
        ).toEqual({ year: 2020, month: 7, day: 3 });
    });

    it("throws when rules is not an array or the date is not real", () => {
        expect(() => getHoliday("2020-07-04T00:00:00Z", {} as never)).toThrow(
            TypeError,
        );
        expect(() => getHoliday("2020-07-04T00:00:00Z", {} as never)).toThrow(
            "`rules` must be an array of holiday rules",
        );
        expect(() => getHoliday("nope", independenceDay)).toThrow(RangeError);
        expect(() => getHoliday("nope", independenceDay)).toThrow("valid date");
    });
});
