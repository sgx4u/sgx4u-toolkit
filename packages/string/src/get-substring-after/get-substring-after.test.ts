import { describe, expect, it } from "vitest";
import { getSubstringAfter } from "./get-substring-after.js";
describe("getSubstringAfter", () => {
    it("reads around the separator", () => {
        const found = getSubstringAfter({ value: "a-b-c", separator: "-" });
        expect(typeof found).toBe("string");
        expect(
            getSubstringAfter({
                value: "abc",
                separator: "-",
                missing: "whole",
            }),
        ).toBe("abc");
        expect(getSubstringAfter({ value: "abc", separator: "-" })).toBe("");
        expect(
            getSubstringAfter({
                value: 1 as unknown as string,
                separator: "-",
            }),
        ).toBeUndefined();
    });
});
