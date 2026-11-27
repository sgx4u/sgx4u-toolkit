import { describe, expect, it } from "vitest";
import { getCartesianProduct } from "./get-cartesian-product.js";

describe("getCartesianProduct", () => {
    it("varies the last array fastest", () => {
        const arrays = Object.freeze([
            Object.freeze([1, 2]),
            Object.freeze(["a", "b"]),
        ]);
        const product = getCartesianProduct({ arrays });
        expect(product).toEqual([
            [1, "a"],
            [1, "b"],
            [2, "a"],
            [2, "b"],
        ]);
        expect(product?.[0]).not.toBe(arrays[0]);
        expect(arrays[0]).toEqual([1, 2]);
    });

    it("returns an empty array when the list or any array is empty", () => {
        expect(getCartesianProduct({ arrays: [] })).toEqual([]);
        expect(getCartesianProduct({ arrays: [[1, 2], []] })).toEqual([]);
    });

    it("returns undefined when a slot is not an array", () => {
        expect(
            getCartesianProduct({ arrays: [[1], "no"] } as never),
        ).toBeUndefined();
        expect(getCartesianProduct({ arrays: "no" } as never)).toBeUndefined();
    });
});
