import { describe, expect, it } from "vitest";
import { getLongestCommonSubsequence } from "./get-longest-common-subsequence.js";

describe("getLongestCommonSubsequence", () => {
    it("returns items from the first array", () => {
        const first = Object.freeze([1, 2, 3, 4]);
        const second = Object.freeze([2, 4, 6]);
        const shared = getLongestCommonSubsequence({ first, second });
        expect(shared).toEqual([2, 4]);
        expect(shared).not.toBe(first);
        expect(first).toEqual([1, 2, 3, 4]);
        expect(second).toEqual([2, 4, 6]);
    });

    it("returns undefined when either side is not an array", () => {
        expect(
            getLongestCommonSubsequence({ first: null, second: [1] } as never),
        ).toBeUndefined();
    });

    it("returns an empty array when nothing is shared", () => {
        expect(
            getLongestCommonSubsequence({ first: [1], second: [2] }),
        ).toEqual([]);
        expect(getLongestCommonSubsequence({ first: [], second: [] })).toEqual(
            [],
        );
    });
});
