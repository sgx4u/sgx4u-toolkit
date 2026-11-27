import { describe, expect, it } from "vitest";
import { getPercentile } from "../index.js";

describe("getPercentile", () => {
    it("covers the documented behavior", () => {
        expect(getPercentile({ values: [1, 2, 3, 4], percentile: 0 })).toBe(1);
        expect(getPercentile({ values: [1, 2, 3, 4], percentile: 100 })).toBe(
            4,
        );
        expect(getPercentile({ values: [1, 2, 3, 4], percentile: 50 })).toBe(
            2.5,
        );
        expect(getPercentile({ values: [], percentile: 50 })).toBeUndefined();
        expect(() => getPercentile({ values: [1], percentile: 101 })).toThrow(
            RangeError,
        );
        expect(() =>
            getPercentile({
                values: [1],
                percentile: 50,
                method: "missing" as "linear",
            }),
        ).toThrow(RangeError);
    });
});
