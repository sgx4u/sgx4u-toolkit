import { describe, expect, it } from "vitest";
import { equalsString } from "./equals-string.js";
describe("equalsString", () => {
    it("compares with a collator", () => {
        expect(equalsString({ first: "a", second: "a" })).toBe(true);
        expect(
            equalsString({ first: "a", second: "A", sensitivity: "accent" }),
        ).toBe(true);
        expect(
            equalsString({
                first: "café",
                second: "CAFÉ",
                sensitivity: "accent",
            }),
        ).toBe(true);
        expect(
            equalsString({
                first: "café",
                second: "cafe",
                sensitivity: "accent",
            }),
        ).toBe(false);
        expect(equalsString({ first: "a", second: "b" })).toBe(false);
        expect(
            equalsString({ first: 1 as unknown as string, second: "a" }),
        ).toBe(false);
        expect(() =>
            equalsString({
                first: "a",
                second: "a",
                sensitivity: "nope" as "base",
            }),
        ).toThrow(RangeError);
    });
});
