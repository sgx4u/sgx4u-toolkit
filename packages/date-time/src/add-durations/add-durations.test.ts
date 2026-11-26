import { describe, expect, it } from "vitest";
import { addDurations } from "../index.js";

describe("addDurations", () => {
    it("adds fields and drops zeros", () => {
        expect(addDurations({ hours: 1 }, { minutes: 30 })).toEqual({
            hours: 1,
            minutes: 30,
        });
        expect(addDurations({ hours: 2 }, { hours: -1 })).toEqual({
            hours: 1,
        });
        expect(addDurations({ hours: 1 }, { hours: -1 })).toEqual({});
        expect(addDurations({}, {})).toEqual({});
    });

    it("keeps months unnormalized at a year boundary", () => {
        expect(addDurations({ months: 11 }, { months: 1 })).toEqual({
            months: 12,
        });
        expect(addDurations({ years: 1 }, { days: 1 })).toEqual({
            years: 1,
            days: 1,
        });
    });

    it("rejects a sum that mixes signs and a value that is not a duration", () => {
        expect(() => addDurations({ hours: 1 }, { days: -1 })).toThrow(
            RangeError,
        );
        expect(() => addDurations({ hours: 1 }, { days: -1 })).toThrow(
            "`first` must be a duration that can be added to `second`; received [object Object].",
        );
        expect(() => addDurations(null as never, { hours: 1 })).toThrow(
            TypeError,
        );
        expect(() => addDurations(null as never, { hours: 1 })).toThrow(
            "`first` must be a duration object; received null.",
        );
        expect(() =>
            addDurations({ hours: 1, extra: 1 } as never, { minutes: 1 }),
        ).toThrow(RangeError);
    });
});
