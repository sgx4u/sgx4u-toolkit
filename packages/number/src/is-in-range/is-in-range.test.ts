import { describe, expect, it } from "vitest";
import { isInRange } from "../index.js";

describe("isInRange", () => {
    it("covers the documented behavior", () => {
        expect(isInRange({ value: 0, start: 0, end: 2 })).toBe(true);
        expect(isInRange({ value: 2, start: 0, end: 2 })).toBe(false);
        expect(
            isInRange({ value: 2, start: 0, end: 2, includeEnd: true }),
        ).toBe(true);
        expect(
            isInRange({ value: 0, start: 0, end: 2, includeStart: false }),
        ).toBe(false);
        expect(isInRange({ value: Number.NaN, start: 0, end: 1 })).toBe(false);
        expect(isInRange({ value: 1, start: 2, end: 0 })).toBe(false);
    });
});
