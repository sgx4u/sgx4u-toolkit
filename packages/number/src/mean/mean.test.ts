import { describe, expect, it } from "vitest";
import { mean } from "../index.js";

describe("mean", () => {
    it("covers the documented behavior", () => {
        expect(mean([1, 2, 3])).toBe(2);
        expect(mean([])).toBeUndefined();
        expect(mean([Number.NaN])).toBeUndefined();
    });
});
