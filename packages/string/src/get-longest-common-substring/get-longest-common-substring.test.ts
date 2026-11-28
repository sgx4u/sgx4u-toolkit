import { describe, expect, it } from "vitest";
import { getLongestCommonSubstring } from "./get-longest-common-substring.js";
describe("getLongestCommonSubstring", () => {
    it("finds the first longest shared piece", () => {
        expect(getLongestCommonSubstring({ first: "abcd", second: "bc" })).toBe(
            "bc",
        );
        expect(
            getLongestCommonSubstring({ first: "abcXXXabd", second: "abdabc" }),
        ).toBe("abc");
        expect(getLongestCommonSubstring({ first: "abc", second: "xyz" })).toBe(
            "",
        );
        expect(
            getLongestCommonSubstring({
                first: 1 as unknown as string,
                second: "a",
            }),
        ).toBeUndefined();
    });
});
