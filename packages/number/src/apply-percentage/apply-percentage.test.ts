import { describe, expect, it } from "vitest";
import { applyPercentage } from "../index.js";

describe("applyPercentage", () => {
    it("covers the documented behavior", () => {
        expect(applyPercentage({ value: 200, percent: 10 })).toBe(20);
        expect(
            applyPercentage({ value: Number.NaN, percent: 10 }),
        ).toBeUndefined();
    });
});
