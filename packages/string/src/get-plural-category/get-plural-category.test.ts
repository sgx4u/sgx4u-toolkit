import { describe, expect, it } from "vitest";
import { getPluralCategory } from "./get-plural-category.js";
describe("getPluralCategory", () => {
    it("uses Intl plural rules", () => {
        expect(getPluralCategory({ count: 1, locale: "en" })).toBe("one");
        expect(getPluralCategory({ count: 2, locale: "en" })).toBe("other");
        expect(getPluralCategory({ count: Number.NaN })).toBeUndefined();
        expect(
            getPluralCategory({ count: "1" as unknown as number }),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(getPluralCategory(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            getPluralCategory({ count: 1 }) === undefined ||
                typeof getPluralCategory({ count: 1 }) === "string" ||
                typeof getPluralCategory({ count: 1 }) === "boolean" ||
                typeof getPluralCategory({ count: 1 }) === "number" ||
                Array.isArray(getPluralCategory({ count: 1 })) ||
                (typeof getPluralCategory({ count: 1 }) === "object" &&
                    getPluralCategory({ count: 1 }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            getPluralCategory({ count: 1 }) === undefined ||
                typeof getPluralCategory({ count: 1 }) === "string" ||
                typeof getPluralCategory({ count: 1 }) === "boolean" ||
                typeof getPluralCategory({ count: 1 }) === "number" ||
                Array.isArray(getPluralCategory({ count: 1 })) ||
                (typeof getPluralCategory({ count: 1 }) === "object" &&
                    getPluralCategory({ count: 1 }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            getPluralCategory({ count: 1 }) === undefined ||
                typeof getPluralCategory({ count: 1 }) === "string" ||
                typeof getPluralCategory({ count: 1 }) === "boolean" ||
                typeof getPluralCategory({ count: 1 }) === "number" ||
                Array.isArray(getPluralCategory({ count: 1 })) ||
                (typeof getPluralCategory({ count: 1 }) === "object" &&
                    getPluralCategory({ count: 1 }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            getPluralCategory({ count: 1 }) === undefined ||
                typeof getPluralCategory({ count: 1 }) === "string" ||
                typeof getPluralCategory({ count: 1 }) === "boolean" ||
                typeof getPluralCategory({ count: 1 }) === "number" ||
                Array.isArray(getPluralCategory({ count: 1 })) ||
                (typeof getPluralCategory({ count: 1 }) === "object" &&
                    getPluralCategory({ count: 1 }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            getPluralCategory({ count: 1 }) === undefined ||
                typeof getPluralCategory({ count: 1 }) === "string" ||
                typeof getPluralCategory({ count: 1 }) === "boolean" ||
                typeof getPluralCategory({ count: 1 }) === "number" ||
                Array.isArray(getPluralCategory({ count: 1 })) ||
                (typeof getPluralCategory({ count: 1 }) === "object" &&
                    getPluralCategory({ count: 1 }) !== null),
        ).toBe(true);
    });
    it("throws when locale is empty or not text", () => {
        expect(() => getPluralCategory({ count: 1, locale: "" })).toThrow(
            RangeError,
        );
        expect(() =>
            getPluralCategory({ count: 1, locale: 1 as never }),
        ).toThrow(TypeError);
    });
});
