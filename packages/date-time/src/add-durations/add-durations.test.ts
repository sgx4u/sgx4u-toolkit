import { describe, expect, it } from "vitest";
import { addDurations } from "../index.js";

describe("addDurations", () => {
    it("adds fields and drops zeros", () => {
        expect(
            addDurations({ first: { hours: 1 }, second: { minutes: 30 } }),
        ).toEqual({
            hours: 1,
            minutes: 30,
        });
        expect(
            addDurations({ first: { hours: 2 }, second: { hours: -1 } }),
        ).toEqual({
            hours: 1,
        });
        expect(
            addDurations({ first: { hours: 1 }, second: { hours: -1 } }),
        ).toEqual({});
        expect(addDurations({ first: {}, second: {} })).toEqual({});
    });

    it("keeps months unnormalized at a year boundary", () => {
        expect(
            addDurations({ first: { months: 11 }, second: { months: 1 } }),
        ).toEqual({
            months: 12,
        });
        expect(
            addDurations({ first: { years: 1 }, second: { days: 1 } }),
        ).toEqual({
            years: 1,
            days: 1,
        });
    });

    it("rejects a sum that mixes signs and returns undefined for bad data", () => {
        expect(() =>
            addDurations({ first: { hours: 1 }, second: { days: -1 } }),
        ).toThrow(RangeError);
        expect(() =>
            addDurations({ first: { hours: 1 }, second: { days: -1 } }),
        ).toThrow(
            "`first` must be a duration that can be added to `second`; received [object Object].",
        );
        expect(
            addDurations({ first: null as never, second: { hours: 1 } }),
        ).toBeUndefined();
        expect(
            addDurations({
                first: { hours: 1, extra: 1 } as never,
                second: { minutes: 1 },
            }),
        ).toBeUndefined();
    });
});