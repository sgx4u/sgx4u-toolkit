import { describe, expect, it } from "vitest";
import { getBestItem } from "./get-best-item.js";

describe("getBestItem", () => {
    it("returns undefined for an empty array or a non-array", () => {
        expect(
            getBestItem({
                array: [],
                isBetter: () => true,
            }),
        ).toBeUndefined();
        expect(getBestItem(undefined as never)).toBeUndefined();
    });

    it("walks left to right and keeps the first champion", () => {
        const values = Object.freeze(["aa", "b", "ccc", "dd"]);
        expect(
            getBestItem({
                array: values,
                isBetter: (candidate, champion) =>
                    candidate.length > champion.length,
            }),
        ).toBe("ccc");
        expect(values).toEqual(["aa", "b", "ccc", "dd"]);
        expect(
            getBestItem({
                array: ["a", "b"],
                isBetter: () => false,
            }),
        ).toBe("a");
    });

    it("throws when isBetter is not a function", () => {
        expect(() =>
            getBestItem({ array: [1], isBetter: "no" as never }),
        ).toThrow(TypeError);
    });
});
