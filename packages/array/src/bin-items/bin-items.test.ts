import { describe, expect, it } from "vitest";
import { binItems } from "./bin-items.js";

describe("binItems", () => {
    it("returns undefined for an empty array or a non-array", () => {
        expect(binItems({ array: [], binCount: 2 })).toBeUndefined();
        expect(binItems({ array: "no", binCount: 2 } as never)).toBeUndefined();
    });

    it("splits the data into equal bins and closes the last bin", () => {
        const values = Object.freeze([1, 2, 3, 4, 5]);
        const bins = binItems({ array: values, binCount: 2 });
        expect(bins).toEqual([
            { start: 1, end: 3, count: 2, items: [1, 2] },
            { start: 3, end: 5, count: 3, items: [3, 4, 5] },
        ]);
        expect(bins).not.toBe(values);
        expect(values).toEqual([1, 2, 3, 4, 5]);
    });

    it("uses width 1 when every value is the same and binCount is set", () => {
        const bins = binItems({ array: [5, 5], binCount: 2 });
        expect(bins?.[0]).toEqual({
            start: 5,
            end: 6,
            count: 2,
            items: [5, 5],
        });
        expect(bins?.[1]).toEqual({ start: 6, end: 7, count: 0, items: [] });
    });

    it("sizes bins from binWidth and excludes values outside the range", () => {
        const bins = binItems({
            array: [1, 2, 10],
            binWidth: 5,
            start: 0,
            end: 5,
        });
        expect(bins).toHaveLength(1);
        expect(bins?.[0]?.items).toEqual([1, 2]);
        expect(bins?.[0]?.count).toBe(2);
    });

    it("throws when the bin size is missing, duplicated, or not positive", () => {
        expect(() => binItems({ array: [1, 2] })).toThrow(RangeError);
        expect(() =>
            binItems({ array: [1, 2], binCount: 2, binWidth: 1 }),
        ).toThrow(RangeError);
        expect(() => binItems({ array: [1, 2], binCount: 0 })).toThrow(
            RangeError,
        );
        expect(() => binItems({ array: [1, 2], binWidth: -1 })).toThrow(
            RangeError,
        );
        expect(() =>
            binItems({ array: [1, 2], binCount: 1, end: 0, start: 3 }),
        ).toThrow(RangeError);
    });
});
