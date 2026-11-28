import { describe, expect, it } from "vitest";
import { isEven } from "../index.js";

describe("isEven", () => {
    it("accepts even integers", () => {
        expect(isEven(2)).toBe(true);
        expect(isEven(0)).toBe(true);
        expect(isEven(-4)).toBe(true);
        expect(isEven(-0)).toBe(true);
    });

    it("rejects odds and non-integers", () => {
        expect(isEven(1)).toBe(false);
        expect(isEven(2.5)).toBe(false);
        expect(isEven(Number.NaN)).toBe(false);
        expect(isEven("2")).toBe(false);
    });
});
