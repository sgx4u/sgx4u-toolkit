import { describe, expect, it } from "vitest";
import { getLongestCommonSuffix } from "./get-longest-common-suffix.js";

describe("getLongestCommonSuffix", () => {
    it("returns the shared trailing items in forward order", () => {
        const first = Object.freeze([1, 2, 3]);
        const second = Object.freeze([9, 2, 3]);
        const suffix = getLongestCommonSuffix({ first, second });
        expect(suffix).toEqual([2, 3]);
        expect(suffix).not.toBe(first);
        expect(first).toEqual([1, 2, 3]);
    });

    it("returns undefined when either side is not an array", () => {
        expect(
            getLongestCommonSuffix({ first: "no", second: [1] } as never),
        ).toBeUndefined();
    });

    it("returns an empty array when the last items differ", () => {
        expect(
            getLongestCommonSuffix({ first: [1, 2], second: [1, 9] }),
        ).toEqual([]);
    });
});
