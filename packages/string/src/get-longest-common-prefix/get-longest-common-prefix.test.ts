import { describe, expect, it } from "vitest";
import { getLongestCommonPrefix } from "./get-longest-common-prefix.js";
describe("getLongestCommonPrefix", () => {
    it("finds the shared prefix", () => {
        expect(getLongestCommonPrefix(["flower", "flow"])).toBe("flow");
        expect(getLongestCommonPrefix(["👍a", "👍b"])).toBe("👍");
        expect(getLongestCommonPrefix(["a", "b"])).toBe("");
        expect(getLongestCommonPrefix([])).toBeUndefined();
        expect(
            getLongestCommonPrefix(["a", 1 as unknown as string]),
        ).toBeUndefined();
    });
});
