import { describe, expect, it } from "vitest";
import { fromRomanNumeral } from "../index.js";

describe("fromRomanNumeral", () => {
    it("covers the documented behavior", () => {
        expect(fromRomanNumeral("IV")).toBe(4);
        expect(fromRomanNumeral("iv")).toBe(4);
        expect(fromRomanNumeral("CMXCIX")).toBe(999);
        expect(fromRomanNumeral("IIX")).toBeUndefined();
        expect(fromRomanNumeral("VV")).toBeUndefined();
        expect(fromRomanNumeral("")).toBeUndefined();
        expect(fromRomanNumeral("(IV)")).toBe(4000);
    });
});
