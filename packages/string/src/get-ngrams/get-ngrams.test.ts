import { describe, expect, it } from "vitest";
import { getNgrams } from "./get-ngrams.js";
describe("getNgrams", () => {
    it("returns overlapping slices", () => {
        expect(getNgrams("abcd")).toEqual(["ab", "bc", "cd"]);
        expect(getNgrams({ value: "ab", size: 5 })).toEqual([]);
        expect(() => getNgrams({ value: "ab", size: 0 })).toThrow(RangeError);
    });
});
