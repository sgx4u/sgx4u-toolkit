import { describe, expect, it } from "vitest";
import { getDaysInMonth } from "../index.js";

describe("getDaysInMonth", () => {
    it("returns 28 through 31, with February 29 in a leap year", () => {
        expect(getDaysInMonth({ year: 2024, month: 1 })).toBe(31);
        expect(getDaysInMonth({ year: 2024, month: 2 })).toBe(29);
        expect(getDaysInMonth({ year: 2023, month: 2 })).toBe(28);
        expect(getDaysInMonth({ year: 1900, month: 2 })).toBe(28);
        expect(getDaysInMonth({ year: 2000, month: 2 })).toBe(29);
        expect(getDaysInMonth({ year: 2024, month: 4 })).toBe(30);
        expect(getDaysInMonth({ year: 2024, month: 12 })).toBe(31);
    });

    it("returns undefined when the month or year is not usable", () => {
        expect(getDaysInMonth({ year: 2024, month: 0 })).toBeUndefined();
        expect(getDaysInMonth({ year: 2024, month: 13 })).toBeUndefined();
        expect(getDaysInMonth({ year: 2024, month: 1.5 })).toBeUndefined();
        expect(
            getDaysInMonth({ year: "2024" as unknown as number, month: 1 }),
        ).toBeUndefined();
    });
});
