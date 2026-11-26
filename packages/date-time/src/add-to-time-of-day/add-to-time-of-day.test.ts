import { describe, expect, it } from "vitest";
import { addToTimeOfDay } from "../index.js";

const midnight = { hour: 0, minute: 0, second: 0, millisecond: 0 };

describe("addToTimeOfDay", () => {
    it("wraps forward past midnight", () => {
        expect(
            addToTimeOfDay(
                { hour: 23, minute: 30, second: 0, millisecond: 0 },
                { hours: 2 },
            ),
        ).toEqual({
            time: { hour: 1, minute: 30, second: 0, millisecond: 0 },
            dayOffset: 1,
        });
    });

    it("lands on midnight and walks backward into the previous day", () => {
        expect(
            addToTimeOfDay(
                { hour: 23, minute: 59, second: 59, millisecond: 500 },
                { milliseconds: 500 },
            ),
        ).toEqual({ time: midnight, dayOffset: 1 });
        expect(
            addToTimeOfDay(
                { hour: 1, minute: 30, second: 0, millisecond: 0 },
                { hours: -2 },
            ),
        ).toEqual({
            time: { hour: 23, minute: 30, second: 0, millisecond: 0 },
            dayOffset: -1,
        });
        expect(
            addToTimeOfDay(
                { hour: 23, minute: 0, second: 0, millisecond: 0 },
                { days: 1, hours: 1 },
            ),
        ).toEqual({ time: midnight, dayOffset: 2 });
    });

    it("rejects months, years, and a value that is not a time of day", () => {
        expect(() =>
            addToTimeOfDay(
                { hour: 1, minute: 0, second: 0, millisecond: 0 },
                { months: 1 },
            ),
        ).toThrow(RangeError);
        expect(() =>
            addToTimeOfDay(
                { hour: 1, minute: 0, second: 0, millisecond: 0 },
                { years: 1 },
            ),
        ).toThrow(
            "`duration` must be free of months and years; received [object Object].",
        );
        expect(() => addToTimeOfDay(null as never, { hours: 1 })).toThrow(
            TypeError,
        );
        expect(() => addToTimeOfDay(null as never, { hours: 1 })).toThrow(
            "`time` must be a time of day; received null.",
        );
    });
});
