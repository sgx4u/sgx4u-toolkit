import { describe, expect, it } from "vitest";
import { getLocaleNumberSymbols } from "../index.js";

describe("getLocaleNumberSymbols", () => {
    it("covers the documented behavior", () => {
        expect(getLocaleNumberSymbols({ locale: "de-DE" }).decimal).toBe(",");
        expect(getLocaleNumberSymbols({ locale: "en-US" }).group).toBe(",");
        expect(getLocaleNumberSymbols({ locale: "ar-EG" }).decimal).toBe("٫");
        expect(() => getLocaleNumberSymbols({ locale: "en-" })).toThrow(
            RangeError,
        );
    });
});
