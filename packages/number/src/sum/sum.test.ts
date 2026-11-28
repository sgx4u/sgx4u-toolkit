import { describe, expect, it } from "vitest";
import { sum } from "../index.js";

describe("sum", () => {
    it("covers the documented behavior", () => {
        expect(sum([])).toBe(0);
        expect(sum([1, 2, 3])).toBe(6);
        expect(sum([1e20, 0.1, -1e20])).toBe(0.1);
        expect(sum([Number.NaN])).toBeUndefined();
    });
});
