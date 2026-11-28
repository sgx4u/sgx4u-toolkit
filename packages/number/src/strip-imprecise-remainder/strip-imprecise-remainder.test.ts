import { describe, expect, it } from "vitest";
import { stripImpreciseRemainder } from "../index.js";

describe("stripImpreciseRemainder", () => {
    it("covers the documented behavior", () => {
        expect(stripImpreciseRemainder(0.1 + 0.2)).toBe(0.3);
        expect(stripImpreciseRemainder(0.09999999999999998)).toBe(0.1);
        expect(stripImpreciseRemainder(1 / 3)).toBe(1 / 3);
        expect(stripImpreciseRemainder(Number.NaN)).toBeUndefined();
        expect(Object.is(stripImpreciseRemainder(-0), -0)).toBe(true);
    });
});
