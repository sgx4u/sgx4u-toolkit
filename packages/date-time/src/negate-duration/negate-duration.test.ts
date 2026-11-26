import { describe, expect, it } from "vitest";
import { negateDuration } from "../index.js";

describe("negateDuration", () => {
    it("flips every field and leaves the input unchanged", () => {
        const duration = { years: 1, months: 2, days: 3, hours: 4, minutes: 0 };
        const negated = negateDuration(duration);

        expect(negated).toEqual({
            years: -1,
            months: -2,
            days: -3,
            hours: -4,
            minutes: 0,
        });
        expect(duration).toEqual({
            years: 1,
            months: 2,
            days: 3,
            hours: 4,
            minutes: 0,
        });
        expect(negateDuration({ hours: -2, seconds: -1.5 })).toEqual({
            hours: 2,
            seconds: 1.5,
        });
        expect(negateDuration({})).toEqual({});
        expect(negateDuration({ milliseconds: 0 })).toEqual({
            milliseconds: 0,
        });
        expect(negateDuration(negated)).toEqual(duration);
    });

    it("throws when the value is not a single-sign duration", () => {
        expect(() => negateDuration({ days: 1, hours: -1 })).toThrow(
            RangeError,
        );
        expect(() => negateDuration({ days: 1.5 })).toThrow(RangeError);
        expect(() => negateDuration({ hours: Number.NaN })).toThrow(RangeError);
        expect(() =>
            negateDuration(null as unknown as { hours: number }),
        ).toThrow(TypeError);
        expect(() =>
            negateDuration([] as unknown as { hours: number }),
        ).toThrow(TypeError);
        expect(() =>
            negateDuration({ fortnights: 1 } as unknown as { hours: number }),
        ).toThrow(RangeError);
    });
});
