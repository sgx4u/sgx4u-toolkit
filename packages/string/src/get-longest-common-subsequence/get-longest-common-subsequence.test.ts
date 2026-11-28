import { describe, expect, it } from "vitest";
import { getLongestCommonSubsequence } from "./get-longest-common-subsequence.js";
describe("getLongestCommonSubsequence", () => {
    it("keeps a non-contiguous match", () => {
        expect(
            getLongestCommonSubsequence({ first: "abc", second: "ac" }),
        ).toBe("ac");
        expect(getLongestCommonSubsequence({ first: "", second: "" })).toBe("");
    });
});
