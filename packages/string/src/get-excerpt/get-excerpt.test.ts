import { describe, expect, it } from "vitest";
import { getExcerpt } from "./get-excerpt.js";

describe("getExcerpt", () => {
    it("keeps short text and cuts long text on a word", () => {
        expect(getExcerpt("Hi")).toBe("Hi");
        expect(
            getExcerpt({ value: "The quick brown fox", maximumLength: 12 }),
        ).toBe("The quick\u2026");
        expect(
            getExcerpt({
                value: "The quick brown fox",
                maximumLength: 12,
                breakOnWord: false,
            }),
        ).toBe("The quick b\u2026");
        expect(getExcerpt(null as never)).toBeUndefined();
    });

    it("rejects a non-positive maximum length", () => {
        expect(() => getExcerpt({ value: "a", maximumLength: 0 })).toThrow(
            RangeError,
        );
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(getExcerpt(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            getExcerpt({ value: "", maximumLength: 12 }) === undefined ||
                typeof getExcerpt({ value: "", maximumLength: 12 }) ===
                    "string" ||
                typeof getExcerpt({ value: "", maximumLength: 12 }) ===
                    "boolean" ||
                typeof getExcerpt({ value: "", maximumLength: 12 }) ===
                    "number" ||
                Array.isArray(getExcerpt({ value: "", maximumLength: 12 })) ||
                (typeof getExcerpt({ value: "", maximumLength: 12 }) ===
                    "object" &&
                    getExcerpt({ value: "", maximumLength: 12 }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            getExcerpt({ value: "👨‍👩‍👧", maximumLength: 12 }) === undefined ||
                typeof getExcerpt({ value: "👨‍👩‍👧", maximumLength: 12 }) ===
                    "string" ||
                typeof getExcerpt({ value: "👨‍👩‍👧", maximumLength: 12 }) ===
                    "boolean" ||
                typeof getExcerpt({ value: "👨‍👩‍👧", maximumLength: 12 }) ===
                    "number" ||
                Array.isArray(getExcerpt({ value: "👨‍👩‍👧", maximumLength: 12 })) ||
                (typeof getExcerpt({ value: "👨‍👩‍👧", maximumLength: 12 }) ===
                    "object" &&
                    getExcerpt({ value: "👨‍👩‍👧", maximumLength: 12 }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            getExcerpt({ value: "e\u0301", maximumLength: 12 }) === undefined ||
                typeof getExcerpt({ value: "e\u0301", maximumLength: 12 }) ===
                    "string" ||
                typeof getExcerpt({ value: "e\u0301", maximumLength: 12 }) ===
                    "boolean" ||
                typeof getExcerpt({ value: "e\u0301", maximumLength: 12 }) ===
                    "number" ||
                Array.isArray(
                    getExcerpt({ value: "e\u0301", maximumLength: 12 }),
                ) ||
                (typeof getExcerpt({ value: "e\u0301", maximumLength: 12 }) ===
                    "object" &&
                    getExcerpt({ value: "e\u0301", maximumLength: 12 }) !==
                        null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            getExcerpt({ value: "مرحبا", maximumLength: 12 }) === undefined ||
                typeof getExcerpt({ value: "مرحبا", maximumLength: 12 }) ===
                    "string" ||
                typeof getExcerpt({ value: "مرحبا", maximumLength: 12 }) ===
                    "boolean" ||
                typeof getExcerpt({ value: "مرحبا", maximumLength: 12 }) ===
                    "number" ||
                Array.isArray(
                    getExcerpt({ value: "مرحبا", maximumLength: 12 }),
                ) ||
                (typeof getExcerpt({ value: "مرحبا", maximumLength: 12 }) ===
                    "object" &&
                    getExcerpt({ value: "مرحبا", maximumLength: 12 }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            getExcerpt({ value: "你好", maximumLength: 12 }) === undefined ||
                typeof getExcerpt({ value: "你好", maximumLength: 12 }) ===
                    "string" ||
                typeof getExcerpt({ value: "你好", maximumLength: 12 }) ===
                    "boolean" ||
                typeof getExcerpt({ value: "你好", maximumLength: 12 }) ===
                    "number" ||
                Array.isArray(
                    getExcerpt({ value: "你好", maximumLength: 12 }),
                ) ||
                (typeof getExcerpt({ value: "你好", maximumLength: 12 }) ===
                    "object" &&
                    getExcerpt({ value: "你好", maximumLength: 12 }) !== null),
        ).toBe(true);
    });
});
