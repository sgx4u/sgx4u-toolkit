import { describe, expect, it } from "vitest";
import { getCombinations } from "./get-combinations.js";

describe("getCombinations", () => {
    it("returns combinations in lexicographic index order", () => {
        const values = Object.freeze([1, 2, 3]);
        const combinations = getCombinations({ array: values, size: 2 });
        expect(combinations).toEqual([
            [1, 2],
            [1, 3],
            [2, 3],
        ]);
        expect(combinations?.[0]).not.toBe(values);
        expect(values).toEqual([1, 2, 3]);
    });

    it("returns one empty combination when size is 0", () => {
        expect(getCombinations({ array: [1, 2], size: 0 })).toEqual([[]]);
        expect(getCombinations({ array: [], size: 0 })).toEqual([[]]);
    });

    it("returns an empty array when size is greater than the length", () => {
        expect(getCombinations({ array: [1, 2], size: 3 })).toEqual([]);
    });

    it("returns undefined when array is not an array", () => {
        expect(
            getCombinations({ array: "no", size: 1 } as never),
        ).toBeUndefined();
    });

    it("throws when size is not a non-negative integer", () => {
        expect(() => getCombinations({ array: [1], size: -1 })).toThrow(
            RangeError,
        );
        expect(() =>
            getCombinations({ array: [1], size: "2" as never }),
        ).toThrow(TypeError);
    });
});
