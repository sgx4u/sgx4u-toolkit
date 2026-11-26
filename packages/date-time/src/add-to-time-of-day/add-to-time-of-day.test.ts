import { describe, expect, it } from "vitest";
import { addToTimeOfDay } from "../index.js";

const midnight = { hour: 0, minute: 0, second: 0, millisecond: 0 };

describe("addToTimeOfDay", () => {
    it("wraps forward past midnight", () => {
        expect(
            addToTimeOfDay({
                time: { hour: 23, minute: 30, second: 0, millisecond: 0 },
                duration: { hours: 2 },
            }),
        ).toEqual({
            time: { hour: 1, minute: 30, second: 0, millisecond: 0 },
            dayOffset: 1,
        });
    });

    it("lands on midnight and walks backward into the previous day", () => {
        expect(
            addToTimeOfDay({
                time: { hour: 23, minute: 59, second: 59, millisecond: 500 },
                duration: { milliseconds: 500 },
            }),
        ).toEqual({ time: midnight, dayOffset: 1 });
        expect(
            addToTimeOfDay({
                time: { hour: 1, minute: 30, second: 0, millisecond: 0 },
                duration: { hours: -2 },
            }),
        ).toEqual({
            time: { hour: 23, minute: 30, second: 0, millisecond: 0 },
            dayOffset: -1,
        });
        expect(
            addToTimeOfDay({
                time: { hour: 23, minute: 0, second: 0, millisecond: 0 },
                duration: { days: 1, hours: 1 },
            }),
        ).toEqual({ time: midnight, dayOffset: 2 });
    });

    it("rejects months and years and returns undefined for bad data", () => {
        expect(() =>
            addToTimeOfDay({
                time: { hour: 1, minute: 0, second: 0, millisecond: 0 },
                duration: { months: 1 },
            }),
        ).toThrow(RangeError);
        expect(() =>
            addToTimeOfDay({
                time: { hour: 1, minute: 0, second: 0, millisecond: 0 },
                duration: { years: 1 },
            }),
        ).toThrow(
            "`duration` must be free of months and years; received [object Object].",
        );
        expect(
            addToTimeOfDay({ time: null as never, duration: { hours: 1 } }),
        ).toBeUndefined();
    });
});