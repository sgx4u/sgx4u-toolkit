import { describe, expect, it } from "vitest";
import { getInterquartileRange } from "../index.js";

describe("getInterquartileRange", () => {
    it("covers the documented behavior", () => {
        expect(getInterquartileRange([1, 2, 3, 4, 5])).toEqual(
            expect.any(Number),
        );
        expect(getInterquartileRange([])).toBeUndefined();
    });
});
