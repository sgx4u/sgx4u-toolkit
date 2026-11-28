import { describe, expect, it } from "vitest";
import { getSubstringBetween } from "./get-substring-between.js";
describe("getSubstringBetween", () => {
    it("reads between markers", () => {
        expect(
            getSubstringBetween({ value: "a[b]c", start: "[", end: "]" }),
        ).toBe("b");
        expect(
            getSubstringBetween({ value: "abc", start: "[", end: "]" }),
        ).toBe("");
        expect(
            getSubstringBetween({
                value: "abc",
                start: "[",
                end: "]",
                missing: "whole",
            }),
        ).toBe("abc");
    });
});
