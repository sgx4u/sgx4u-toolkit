import { describe, expect, it } from "vitest";
import { isValidDuration } from "../index.js";

describe("isValidDuration", () => {
    it("accepts hours and minutes", () => {
        expect(isValidDuration({ hours: 1, minutes: 30 })).toBe(true);
    });

    it("accepts zero and a fraction on the smallest clock field", () => {
        expect(isValidDuration({})).toBe(true);
        expect(isValidDuration({ hours: 0 })).toBe(true);
        expect(isValidDuration({ hours: -1 })).toBe(true);
        expect(isValidDuration({ hours: 1.5 })).toBe(true);
        expect(isValidDuration({ hours: 1, minutes: 1.5 })).toBe(true);
        expect(isValidDuration({ milliseconds: 0.5 })).toBe(true);
    });

    it("returns false and does not throw for a value that is not a duration", () => {
        const rejected = [
            null,
            undefined,
            "P1D",
            1,
            [],
            { hours: 1, minutes: -30 },
            { days: 1.5 },
            { hours: 1.5, minutes: 1 },
            { hours: Number.POSITIVE_INFINITY },
            { weeks: 1.5 },
            { foo: 1 },
        ];
        for (const value of rejected) {
            expect(() => isValidDuration(value)).not.toThrow();
            expect(isValidDuration(value)).toBe(false);
        }
    });

    it("accepts an empty object as a zero duration", () => {
        expect(isValidDuration({})).toBe(true);
        expect(isValidDuration({ years: 0, months: 0, days: 0 })).toBe(true);
    });
});
