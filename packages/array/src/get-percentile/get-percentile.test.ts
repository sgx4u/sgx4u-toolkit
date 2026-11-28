import { describe, expect, it } from "vitest";
import { getPercentile } from "./get-percentile.js";

describe("getPercentile", () => {
    it("returns undefined for an empty array or a non-array", () => {
        expect(getPercentile({ array: [], percentile: 50 })).toBeUndefined();
        expect(
            getPercentile({ array: "no", percentile: 50 } as never),
        ).toBeUndefined();
    });

    it("interpolates by default and can round to the nearest rank", () => {
        const values = Object.freeze([1, 2, 3, 4]);
        expect(getPercentile({ array: values, percentile: 0 })).toBe(1);
        expect(getPercentile({ array: values, percentile: 100 })).toBe(4);
        expect(getPercentile({ array: values, percentile: 50 })).toBe(2.5);
        expect(
            getPercentile({ array: values, percentile: 50, method: "nearest" }),
        ).toBe(3);
        expect(getPercentile({ array: [9], percentile: 0 })).toBe(9);
        expect(getPercentile({ array: [9], percentile: 100 })).toBe(9);
        expect(values).toEqual([1, 2, 3, 4]);
    });

    it("throws when percentile or method is unusable", () => {
        expect(() => getPercentile({ array: [1], percentile: -1 })).toThrow(
            RangeError,
        );
        expect(() => getPercentile({ array: [1], percentile: 101 })).toThrow(
            RangeError,
        );
        expect(() =>
            getPercentile({ array: [1], percentile: Number.NaN }),
        ).toThrow(RangeError);
        expect(() =>
            getPercentile({
                array: [1],
                percentile: 50,
                method: "cubic" as never,
            }),
        ).toThrow(RangeError);
    });
});
