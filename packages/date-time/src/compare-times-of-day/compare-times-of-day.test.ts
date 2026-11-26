import { describe, expect, it } from "vitest";
import { compareTimesOfDay } from "../index.js";

const midnight = { hour: 0, minute: 0, second: 0, millisecond: 0 };
const endOfDay = { hour: 23, minute: 59, second: 59, millisecond: 999 };

describe("compareTimesOfDay", () => {
    it("orders two times of day", () => {
        expect(
            compareTimesOfDay(
                { hour: 9, minute: 0, second: 0, millisecond: 0 },
                { hour: 17, minute: 0, second: 0, millisecond: 0 },
            ),
        ).toBe(-1);
        expect(
            compareTimesOfDay(
                { hour: 17, minute: 0, second: 0, millisecond: 0 },
                { hour: 9, minute: 0, second: 0, millisecond: 0 },
            ),
        ).toBe(1);
        expect(
            compareTimesOfDay(
                { hour: 9, minute: 0, second: 0, millisecond: 0 },
                { hour: 9, minute: 0, second: 0, millisecond: 0 },
            ),
        ).toBe(0);
    });

    it("uses milliseconds so midnight is before the last instant of the day", () => {
        expect(
            compareTimesOfDay(midnight, {
                hour: 0,
                minute: 0,
                second: 0,
                millisecond: 1,
            }),
        ).toBe(-1);
        expect(compareTimesOfDay(endOfDay, midnight)).toBe(1);
        expect(compareTimesOfDay(endOfDay, { ...endOfDay })).toBe(0);
    });

    it("rejects a value that is not a time of day", () => {
        expect(() => compareTimesOfDay(null as never, midnight)).toThrow(
            TypeError,
        );
        expect(() => compareTimesOfDay(null as never, midnight)).toThrow(
            "`first` must be a time of day; received null.",
        );
        expect(() => compareTimesOfDay(midnight, null as never)).toThrow(
            "`second` must be a time of day; received null.",
        );
    });
});
