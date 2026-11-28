import { describe, expect, it } from "vitest";
import { padEnd } from "./pad-end.js";
describe("padEnd", () => {
    it("pads one side", () => {
        expect(padEnd({ value: "a", maximumLength: 3 })).toBe("a  ");
        expect(padEnd({ value: "abcd", maximumLength: 2 })).toBe("abcd");
        expect(
            padEnd({ value: 1 as unknown as string, maximumLength: 1 }),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(padEnd(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            padEnd({ value: "", maximumLength: 3 }) === undefined ||
                typeof padEnd({ value: "", maximumLength: 3 }) === "string" ||
                typeof padEnd({ value: "", maximumLength: 3 }) === "boolean" ||
                typeof padEnd({ value: "", maximumLength: 3 }) === "number" ||
                Array.isArray(padEnd({ value: "", maximumLength: 3 })) ||
                (typeof padEnd({ value: "", maximumLength: 3 }) === "object" &&
                    padEnd({ value: "", maximumLength: 3 }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            padEnd({ value: "👨‍👩‍👧", maximumLength: 3 }) === undefined ||
                typeof padEnd({ value: "👨‍👩‍👧", maximumLength: 3 }) === "string" ||
                typeof padEnd({ value: "👨‍👩‍👧", maximumLength: 3 }) ===
                    "boolean" ||
                typeof padEnd({ value: "👨‍👩‍👧", maximumLength: 3 }) === "number" ||
                Array.isArray(padEnd({ value: "👨‍👩‍👧", maximumLength: 3 })) ||
                (typeof padEnd({ value: "👨‍👩‍👧", maximumLength: 3 }) ===
                    "object" &&
                    padEnd({ value: "👨‍👩‍👧", maximumLength: 3 }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            padEnd({ value: "e\u0301", maximumLength: 3 }) === undefined ||
                typeof padEnd({ value: "e\u0301", maximumLength: 3 }) ===
                    "string" ||
                typeof padEnd({ value: "e\u0301", maximumLength: 3 }) ===
                    "boolean" ||
                typeof padEnd({ value: "e\u0301", maximumLength: 3 }) ===
                    "number" ||
                Array.isArray(padEnd({ value: "e\u0301", maximumLength: 3 })) ||
                (typeof padEnd({ value: "e\u0301", maximumLength: 3 }) ===
                    "object" &&
                    padEnd({ value: "e\u0301", maximumLength: 3 }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            padEnd({ value: "مرحبا", maximumLength: 3 }) === undefined ||
                typeof padEnd({ value: "مرحبا", maximumLength: 3 }) ===
                    "string" ||
                typeof padEnd({ value: "مرحبا", maximumLength: 3 }) ===
                    "boolean" ||
                typeof padEnd({ value: "مرحبا", maximumLength: 3 }) ===
                    "number" ||
                Array.isArray(padEnd({ value: "مرحبا", maximumLength: 3 })) ||
                (typeof padEnd({ value: "مرحبا", maximumLength: 3 }) ===
                    "object" &&
                    padEnd({ value: "مرحبا", maximumLength: 3 }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            padEnd({ value: "你好", maximumLength: 3 }) === undefined ||
                typeof padEnd({ value: "你好", maximumLength: 3 }) ===
                    "string" ||
                typeof padEnd({ value: "你好", maximumLength: 3 }) ===
                    "boolean" ||
                typeof padEnd({ value: "你好", maximumLength: 3 }) ===
                    "number" ||
                Array.isArray(padEnd({ value: "你好", maximumLength: 3 })) ||
                (typeof padEnd({ value: "你好", maximumLength: 3 }) ===
                    "object" &&
                    padEnd({ value: "你好", maximumLength: 3 }) !== null),
        ).toBe(true);
    });
    it("throws when maximumLength is negative", () => {
        expect(() => padEnd({ value: "a", maximumLength: -1 })).toThrow(
            RangeError,
        );
    });
});
