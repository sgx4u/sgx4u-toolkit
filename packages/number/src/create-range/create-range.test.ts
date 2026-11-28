import { describe, expect, it } from "vitest";
import { createRange } from "../index.js";

describe("createRange", () => {
    it("covers the documented behavior", () => {
        expect(createRange({ end: 3 })).toEqual([0, 1, 2]);
        expect(createRange({ start: 1, end: 1 })).toEqual([]);
        expect(createRange({ start: 0, end: 0.3, step: 0.1 })).toEqual([
            0, 0.1, 0.2,
        ]);
        expect(createRange({ start: 3, end: 0, step: -1 })).toEqual([3, 2, 1]);
        expect(() => createRange({ end: 2, step: 0 })).toThrow(RangeError);
        expect(() => createRange({ start: 0, end: 2, step: -1 })).toThrow(
            RangeError,
        );
    });
});
