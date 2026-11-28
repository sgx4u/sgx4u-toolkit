import { describe, expect, it } from "vitest";
import { createInclusiveRange } from "../index.js";

describe("createInclusiveRange", () => {
    it("covers the documented behavior", () => {
        expect(createInclusiveRange({ start: 0, end: 2 })).toEqual([0, 1, 2]);
        expect(createInclusiveRange({ start: 0, end: 1, step: 0.5 })).toEqual([
            0, 0.5, 1,
        ]);
        expect(createInclusiveRange({ start: 2, end: 2 })).toEqual([2]);
        expect(() =>
            createInclusiveRange({ start: 0, end: 1, step: 0 }),
        ).toThrow(RangeError);
    });
});
