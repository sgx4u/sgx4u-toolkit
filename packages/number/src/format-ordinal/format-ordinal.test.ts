import { describe, expect, it } from "vitest";
import { formatOrdinal } from "../index.js";

describe("formatOrdinal", () => {
    it("covers the documented behavior", () => {
        expect(formatOrdinal({ value: 1, locale: "en-US" })).toBe("1st");
        expect(formatOrdinal({ value: 2, locale: "en" })).toBe("2nd");
        expect(formatOrdinal({ value: 3, locale: "en-IN" })).toBe("3rd");
        expect(formatOrdinal({ value: 11, locale: "en-US" })).toBe("11th");
        expect(formatOrdinal({ value: 21, locale: "en-US" })).toBe("21st");
        expect(formatOrdinal({ value: 1.9, locale: "en-US" })).toBe("1st");
        expect(formatOrdinal({ value: 1, locale: "fr-FR" })).toBe("1er");
        expect(formatOrdinal({ value: 2, locale: "fr-FR" })).toBe("2e");
        expect(formatOrdinal({ value: 1, locale: "de-DE" })).toBe("1.");
        expect(formatOrdinal({ value: 1, locale: "ja-JP" })).toBe("1");
        expect(formatOrdinal({ value: Number.NaN })).toBeUndefined();
        expect(() => formatOrdinal({ value: 1, locale: "en-" })).toThrow(
            RangeError,
        );
    });
});
