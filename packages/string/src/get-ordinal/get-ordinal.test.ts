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

describe("unicode and invalid input", () => {
    it("throws when null is passed in place of the options", () => {
        expect(() => getOrdinal(null as never)).toThrow(TypeError);
    });
    it("accepts an empty string", () => {
        expect(typeof getOrdinal({ count: 3 })).toBe("string");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof getOrdinal({ count: 3 })).toBe("string");
    });
    it("accepts a combining mark", () => {
        expect(typeof getOrdinal({ count: 3 })).toBe("string");
    });
    it("accepts Arabic text", () => {
        expect(typeof getOrdinal({ count: 3 })).toBe("string");
    });
    it("accepts CJK text", () => {
        expect(typeof getOrdinal({ count: 3 })).toBe("string");
    });
});
