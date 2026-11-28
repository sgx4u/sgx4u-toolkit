import { describe, expect, it } from "vitest";
import { getOrdinal } from "./get-ordinal.js";
describe("getOrdinal", () => {
    it("uses English suffixes", () => {
        expect(getOrdinal({ count: 1 })).toBe("1st");
        expect(getOrdinal({ count: 2 })).toBe("2nd");
        expect(getOrdinal({ count: 3 })).toBe("3rd");
        expect(getOrdinal({ count: 11 })).toBe("11th");
        expect(getOrdinal({ count: 21 })).toBe("21st");
        expect(() => getOrdinal({ count: 1, locale: "fr" })).toThrow(
            RangeError,
        );
    });
});
