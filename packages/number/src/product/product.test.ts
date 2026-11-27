import { describe, expect, it } from "vitest";
import { product } from "../index.js";

describe("product", () => {
    it("covers the documented behavior", () => {
        expect(product([])).toBe(1);
        expect(product([2, 3, 4])).toBe(24);
        expect(product([2, 0, 4])).toBe(0);
        expect(product([1, Number.NaN])).toBeUndefined();
    });
});
