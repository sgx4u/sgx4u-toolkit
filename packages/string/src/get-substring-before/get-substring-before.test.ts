import { describe, expect, it } from "vitest";
import { getSubstringBefore } from "./get-substring-before.js";
describe("getSubstringBefore", () => {
    it("reads around the separator", () => {
        const found = getSubstringBefore({ value: "a-b-c", separator: "-" });
        expect(typeof found).toBe("string");
        expect(
            getSubstringBefore({
                value: "abc",
                separator: "-",
                missing: "whole",
            }),
        ).toBe("abc");
        expect(getSubstringBefore({ value: "abc", separator: "-" })).toBe("");
        expect(
            getSubstringBefore({
                value: 1 as unknown as string,
                separator: "-",
            }),
        ).toBeUndefined();
    });
});
