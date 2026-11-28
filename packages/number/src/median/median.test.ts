import { describe, expect, it } from "vitest";
import { median } from "../index.js";

describe("median", () => {
    it("covers the documented behavior", () => {
        const values = [3, 1, 2];
        expect(median(values)).toBe(2);
        expect(values).toEqual([3, 1, 2]);
        expect(median([1, 2, 3, 4])).toBe(2.5);
        expect(median([])).toBeUndefined();
        expect(median([1, Number.NaN])).toBeUndefined();
    });
});
