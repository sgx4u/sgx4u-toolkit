import { describe, expect, it } from "vitest";
import { getSubstringAfterLast } from "./get-substring-after-last.js";
describe("getSubstringAfterLast", () => {
    it("reads around the separator", () => {
        const found = getSubstringAfterLast({ value: "a-b-c", separator: "-" });
        expect(typeof found).toBe("string");
        expect(
            getSubstringAfterLast({
                value: "abc",
                separator: "-",
                missing: "whole",
            }),
        ).toBe("abc");
        expect(getSubstringAfterLast({ value: "abc", separator: "-" })).toBe(
            "",
        );
        expect(
            getSubstringAfterLast({
                value: 1 as unknown as string,
                separator: "-",
            }),
        ).toBeUndefined();
    });
});
