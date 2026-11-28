import { describe, expect, it } from "vitest";
import { getRunningTotals } from "./get-running-totals.js";

describe("getRunningTotals", () => {
    it("returns undefined for an empty array or a non-array", () => {
        expect(getRunningTotals({ array: [] })).toBeUndefined();
        expect(getRunningTotals(null as never)).toBeUndefined();
    });

    it("returns inclusive prefix sums in a new array", () => {
        const values = Object.freeze([1, 2, 3]);
        const totals = getRunningTotals({ array: values });
        expect(totals).toEqual([1, 3, 6]);
        expect(totals).not.toBe(values);
        expect(
            getRunningTotals({
                array: [{ n: 1 }, { n: 4 }],
                by: "n",
            }),
        ).toEqual([1, 5]);
        expect(values).toEqual([1, 2, 3]);
    });

    it("throws when an item is not a finite number", () => {
        expect(() => getRunningTotals({ array: [1, "2"] })).toThrow(TypeError);
    });
});
