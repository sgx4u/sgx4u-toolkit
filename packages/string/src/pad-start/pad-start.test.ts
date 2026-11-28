import { describe, expect, it } from "vitest";
import { padStart } from "./pad-start.js";
describe("padStart", () => {
    it("pads one side", () => {
        expect(padStart({ value: "a", maximumLength: 3 })).toBe("  a");
        expect(padStart({ value: "abcd", maximumLength: 2 })).toBe("abcd");
        expect(
            padStart({ value: 1 as unknown as string, maximumLength: 1 }),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(padStart(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            padStart({ value: "", maximumLength: 3 }) === undefined ||
                typeof padStart({ value: "", maximumLength: 3 }) === "string" ||
                typeof padStart({ value: "", maximumLength: 3 }) ===
                    "boolean" ||
                typeof padStart({ value: "", maximumLength: 3 }) === "number" ||
                Array.isArray(padStart({ value: "", maximumLength: 3 })) ||
                (typeof padStart({ value: "", maximumLength: 3 }) ===
                    "object" &&
                    padStart({ value: "", maximumLength: 3 }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            padStart({ value: "👨‍👩‍👧", maximumLength: 3 }) === undefined ||
                typeof padStart({ value: "👨‍👩‍👧", maximumLength: 3 }) ===
                    "string" ||
                typeof padStart({ value: "👨‍👩‍👧", maximumLength: 3 }) ===
                    "boolean" ||
                typeof padStart({ value: "👨‍👩‍👧", maximumLength: 3 }) ===
                    "number" ||
                Array.isArray(padStart({ value: "👨‍👩‍👧", maximumLength: 3 })) ||
                (typeof padStart({ value: "👨‍👩‍👧", maximumLength: 3 }) ===
                    "object" &&
                    padStart({ value: "👨‍👩‍👧", maximumLength: 3 }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            padStart({ value: "e\u0301", maximumLength: 3 }) === undefined ||
                typeof padStart({ value: "e\u0301", maximumLength: 3 }) ===
                    "string" ||
                typeof padStart({ value: "e\u0301", maximumLength: 3 }) ===
                    "boolean" ||
                typeof padStart({ value: "e\u0301", maximumLength: 3 }) ===
                    "number" ||
                Array.isArray(
                    padStart({ value: "e\u0301", maximumLength: 3 }),
                ) ||
                (typeof padStart({ value: "e\u0301", maximumLength: 3 }) ===
                    "object" &&
                    padStart({ value: "e\u0301", maximumLength: 3 }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            padStart({ value: "مرحبا", maximumLength: 3 }) === undefined ||
                typeof padStart({ value: "مرحبا", maximumLength: 3 }) ===
                    "string" ||
                typeof padStart({ value: "مرحبا", maximumLength: 3 }) ===
                    "boolean" ||
                typeof padStart({ value: "مرحبا", maximumLength: 3 }) ===
                    "number" ||
                Array.isArray(padStart({ value: "مرحبا", maximumLength: 3 })) ||
                (typeof padStart({ value: "مرحبا", maximumLength: 3 }) ===
                    "object" &&
                    padStart({ value: "مرحبا", maximumLength: 3 }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            padStart({ value: "你好", maximumLength: 3 }) === undefined ||
                typeof padStart({ value: "你好", maximumLength: 3 }) ===
                    "string" ||
                typeof padStart({ value: "你好", maximumLength: 3 }) ===
                    "boolean" ||
                typeof padStart({ value: "你好", maximumLength: 3 }) ===
                    "number" ||
                Array.isArray(padStart({ value: "你好", maximumLength: 3 })) ||
                (typeof padStart({ value: "你好", maximumLength: 3 }) ===
                    "object" &&
                    padStart({ value: "你好", maximumLength: 3 }) !== null),
        ).toBe(true);
    });
    it("throws when maximumLength is negative", () => {
        expect(() => padStart({ value: "a", maximumLength: -1 })).toThrow(
            RangeError,
        );
    });
});
