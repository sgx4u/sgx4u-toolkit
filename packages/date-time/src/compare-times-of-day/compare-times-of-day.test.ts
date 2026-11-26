import { describe, expect, it } from "vitest";
import { compareTimesOfDay } from "../index.js";

const midnight = { hour: 0, minute: 0, second: 0, millisecond: 0 };
const endOfDay = { hour: 23, minute: 59, second: 59, millisecond: 999 };

describe("compareTimesOfDay", () => {
    it("orders two times of day", () => {
        expect(
            compareTimesOfDay({
                first: { hour: 9, minute: 0, second: 0, millisecond: 0 },
                second: { hour: 17, minute: 0, second: 0, millisecond: 0 },
            }),
        ).toBe(-1);
        expect(
            compareTimesOfDay({
                first: { hour: 17, minute: 0, second: 0, millisecond: 0 },
                second: { hour: 9, minute: 0, second: 0, millisecond: 0 },
            }),
        ).toBe(1);
        expect(
            compareTimesOfDay({
                first: { hour: 9, minute: 0, second: 0, millisecond: 0 },
                second: { hour: 9, minute: 0, second: 0, millisecond: 0 },
            }),
        ).toBe(0);
    });

    it("uses milliseconds so midnight is before the last instant of the day", () => {
        expect(
            compareTimesOfDay({
                first: midnight,
                second: {
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 1,
                },
            }),
        ).toBe(-1);
        expect(compareTimesOfDay({ first: endOfDay, second: midnight })).toBe(
            1,
        );
        expect(
            compareTimesOfDay({ first: endOfDay, second: { ...endOfDay } }),
        ).toBe(0);
    });

    it("returns undefined for a value that is not a time of day", () => {
        expect(
            compareTimesOfDay({
                first: null as never,
                second: midnight,
            }),
        ).toBeUndefined();
        expect(
            compareTimesOfDay({ first: midnight, second: null as never }),
        ).toBeUndefined();
    });
});
