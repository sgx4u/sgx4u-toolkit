import { describe, expect, it } from "vitest";
import { getExtent } from "./get-extent.js";

describe("getExtent", () => {
    it("returns undefined for an empty array or a non-array", () => {
        expect(getExtent({ array: [] })).toBeUndefined();
        expect(getExtent({ array: "no" } as never)).toBeUndefined();
    });

    it("keeps the first minimum and the first maximum", () => {
        const values = Object.freeze([2, 1, 3, 1, 3]);
        expect(getExtent({ array: values })).toEqual({ min: 1, max: 3 });
        expect(values).toEqual([2, 1, 3, 1, 3]);
        const low = { n: 0, id: "low" };
        const lowAgain = { n: 0, id: "low-again" };
        const high = { n: 5, id: "high" };
        const highAgain = { n: 5, id: "high-again" };
        expect(
            getExtent({
                array: [low, high, lowAgain, highAgain],
                by: "n",
            }),
        ).toEqual({ min: low, max: high });
    });

    it("compares items directly when by is omitted", () => {
        expect(getExtent({ array: ["b", "a", "c"] })).toEqual({
            min: "a",
            max: "c",
        });
    });
});
