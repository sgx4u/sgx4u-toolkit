import { describe, expect, it } from "vitest";
import { decreaseByPercentage } from "../index.js";

describe("decreaseByPercentage", () => {
    it("covers the documented behavior", () => {
        expect(decreaseByPercentage({ value: 200, percent: 10 })).toBe(180);
    });
});
