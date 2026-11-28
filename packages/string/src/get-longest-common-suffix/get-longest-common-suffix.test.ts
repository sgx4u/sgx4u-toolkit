import { describe, expect, it } from "vitest";
import { getLongestCommonSuffix } from "./get-longest-common-suffix.js";
describe("getLongestCommonSuffix", () => {
    it("finds the shared suffix", () => {
        expect(getLongestCommonSuffix(["testing", "running"])).toBe("ing");
        expect(getLongestCommonSuffix(["a", "b"])).toBe("");
        expect(getLongestCommonSuffix([])).toBeUndefined();
    });
});
