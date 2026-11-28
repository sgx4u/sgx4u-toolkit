import { describe, expect, it } from "vitest";
import { getLongestCommonPrefix } from "./get-longest-common-prefix.js";

describe("getLongestCommonPrefix", () => {
    it("returns the shared leading items from the first array", () => {
        const first = Object.freeze([1, 2, 3]);
        const second = Object.freeze([1, 2, 9]);
        const prefix = getLongestCommonPrefix({ first, second });
        expect(prefix).toEqual([1, 2]);
        expect(prefix).not.toBe(first);
        expect(first).toEqual([1, 2, 3]);
    });

    it("returns undefined when either side is not an array", () => {
        expect(
            getLongestCommonPrefix({ first: [1], second: "no" } as never),
        ).toBeUndefined();
    });

    it("returns an empty array when the first items differ", () => {
        expect(
            getLongestCommonPrefix({ first: [1, 2], second: [9, 2] }),
        ).toEqual([]);
    });
});
