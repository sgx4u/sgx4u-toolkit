import { describe, expect, it } from "vitest";
import { getSubstringBeforeLast } from "./get-substring-before-last.js";
describe("getSubstringBeforeLast", () => {
    it("reads around the separator", () => {
        const found = getSubstringBeforeLast({
            value: "a-b-c",
            separator: "-",
        });
        expect(typeof found).toBe("string");
        expect(
            getSubstringBeforeLast({
                value: "abc",
                separator: "-",
                missing: "whole",
            }),
        ).toBe("abc");
        expect(getSubstringBeforeLast({ value: "abc", separator: "-" })).toBe(
            "",
        );
        expect(
            getSubstringBeforeLast({
                value: 1 as unknown as string,
                separator: "-",
            }),
        ).toBeUndefined();
    });
});
