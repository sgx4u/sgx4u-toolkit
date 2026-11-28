import { describe, expect, it } from "vitest";
import { compareStrings } from "./compare-strings.js";
describe("compareStrings", () => {
    it("orders strings and can collate numbers", () => {
        expect(compareStrings({ first: "a", second: "b" })).toBe(-1);
        expect(compareStrings({ first: "a", second: "a" })).toBe(0);
        expect(
            compareStrings({
                first: "a2",
                second: "a10",
                numeric: true,
                locale: "en-US",
            }),
        ).toBe(-1);
        expect(
            compareStrings({
                first: "a2",
                second: "a10",
                numeric: false,
                locale: "en-US",
            }),
        ).toBe(1);
        expect(
            compareStrings({ first: "ö", second: "z", locale: "de-DE" }),
        ).toBe(-1);
        expect(compareStrings({ first: "ö", second: "z", locale: "sv" })).toBe(
            1,
        );
        expect(
            compareStrings({ first: 1 as unknown as string, second: "a" }),
        ).toBeUndefined();
        expect(() =>
            compareStrings({
                first: "a",
                second: "b",
                sensitivity: "nope" as "base",
            }),
        ).toThrow(RangeError);
    });
});
