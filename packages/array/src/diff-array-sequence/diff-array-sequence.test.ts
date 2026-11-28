import { describe, expect, it } from "vitest";
import { diffArraySequence } from "./diff-array-sequence.js";

describe("diffArraySequence", () => {
    it("returns undefined when either side is not an array", () => {
        expect(
            diffArraySequence({ first: [1], second: "no" } as never),
        ).toBeUndefined();
    });

    it("returns keep, insert, and remove runs", () => {
        const first = Object.freeze([1, 2, 3]);
        const second = Object.freeze([1, 3, 4]);
        expect(diffArraySequence({ first, second })).toEqual([
            { type: "keep", items: [1] },
            { type: "remove", items: [2] },
            { type: "keep", items: [3] },
            { type: "insert", items: [4] },
        ]);
        expect(first).toEqual([1, 2, 3]);
        expect(second).toEqual([1, 3, 4]);
    });

    it("returns an empty patch for two empty arrays", () => {
        expect(diffArraySequence({ first: [], second: [] })).toEqual([]);
    });
});
