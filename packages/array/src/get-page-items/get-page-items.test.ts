import { describe, expect, it } from "vitest";
import { getPageItems } from "./get-page-items.js";

describe("getPageItems", () => {
    it("returns the slice for a page, including a page past the end", () => {
        const values = Object.freeze(["a", "b", "c", "d", "e"]);
        expect(getPageItems({ array: values, page: 1, pageSize: 2 })).toEqual([
            "a",
            "b",
        ]);
        expect(getPageItems({ array: values, page: 2, pageSize: 2 })).toEqual([
            "c",
            "d",
        ]);
        expect(getPageItems({ array: values, page: 4, pageSize: 2 })).toEqual(
            [],
        );
        expect(getPageItems({ array: values, page: 5, pageSize: 1 })).toEqual([
            "e",
        ]);
        expect(getPageItems({ array: [], page: 1, pageSize: 1 })).toEqual([]);
        expect(values).toEqual(["a", "b", "c", "d", "e"]);
    });

    it("returns undefined when array is not an array", () => {
        expect(
            getPageItems({ array: null, page: 1, pageSize: 1 } as never),
        ).toBeUndefined();
    });

    it("throws when page or pageSize is unusable", () => {
        expect(() =>
            getPageItems({ array: [1], page: 0, pageSize: 1 }),
        ).toThrow(RangeError);
        expect(() =>
            getPageItems({ array: [1], page: 1, pageSize: 0 }),
        ).toThrow(RangeError);
    });
});
