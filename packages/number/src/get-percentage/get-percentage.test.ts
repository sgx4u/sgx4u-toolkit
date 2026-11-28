import { describe, expect, it } from "vitest";
import { getPercentage } from "../index.js";

describe("getPercentage", () => {
    it("covers the documented behavior", () => {
        expect(getPercentage({ part: 1, whole: 4 })).toBe(25);
        expect(getPercentage({ part: 1, whole: 0 })).toBeUndefined();
    });
});
