import { describe, expect, it } from "vitest";
import { assert, integer, property } from "fast-check";
import { fromRomanNumeral, toRomanNumeral } from "../index.js";

describe("toRomanNumeral", () => {
    it("covers the documented behavior", () => {
        expect(toRomanNumeral({ value: 4 })).toBe("IV");
        expect(toRomanNumeral({ value: 999 })).toBe("CMXCIX");
        expect(toRomanNumeral({ value: 3999 })).toBe("MMMCMXCIX");
        expect(toRomanNumeral({ value: 4000 })).toBeUndefined();
        expect(toRomanNumeral({ value: 4000, style: "extended" })).toBe("(IV)");
        expect(toRomanNumeral({ value: 3999999, style: "extended" })).toBe(
            "(MMMCMXCIX)CMXCIX",
        );
        expect(toRomanNumeral({ value: 0 })).toBeUndefined();
        expect(toRomanNumeral({ value: -1 })).toBeUndefined();
        expect(() =>
            toRomanNumeral({ value: 1, style: "long" as "standard" }),
        ).toThrow(RangeError);
        assert(
            property(integer({ min: 1, max: 3999 }), (value) => {
                expect(fromRomanNumeral(toRomanNumeral({ value }) ?? "")).toBe(
                    value,
                );
            }),
        );
    });
});
