import { describe, expect, it } from "vitest";
import { getProduct } from "./get-product.js";

describe("getProduct", () => {
    it("returns 1 for an empty array and undefined for a non-array", () => {
        expect(getProduct({ array: [] })).toBe(1);
        expect(getProduct(null as never)).toBeUndefined();
    });

    it("multiplies finite numbers", () => {
        const values = Object.freeze([2, 3, 4]);
        expect(getProduct({ array: values })).toBe(24);
        expect(getProduct({ array: [0, 5] })).toBe(0);
        expect(getProduct({ array: [-2, -3] })).toBe(6);
        expect(values).toEqual([2, 3, 4]);
    });

    it("throws when by does not return a finite number", () => {
        expect(() =>
            getProduct({ array: [{ n: 1 }, { n: "x" }], by: "n" }),
        ).toThrow(TypeError);
    });
});
