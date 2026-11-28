import { describe, expect, it } from "vitest";
import { increaseByPercentage } from "../index.js";

describe("increaseByPercentage", () => {
    it("covers the documented behavior", () => {
        expect(increaseByPercentage({ value: 200, percent: 10 })).toBe(220);
    });
});
