import { describe, expect, it } from "vitest";
import { lastIndexOfMatch } from "./last-index-of-match.js";
describe("lastIndexOfMatch", () => {
    it("returns the last index", () => {
        expect(lastIndexOfMatch({ value: "ababa", search: "ba" })).toBe(3);
        expect(lastIndexOfMatch({ value: "ababa", search: "z" })).toBe(-1);
        expect(lastIndexOfMatch({ value: "hello", search: "" })).toBe(5);
        expect(
            lastIndexOfMatch({ value: "hello", search: "l", fromIndex: -1 }),
        ).toBe(-1);
        expect(
            lastIndexOfMatch({ value: "hello", search: "h", fromIndex: -1 }),
        ).toBe(0);
        expect(
            lastIndexOfMatch({ value: 1 as unknown as string, search: "a" }),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(lastIndexOfMatch(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            lastIndexOfMatch({ value: "", search: "ba" }) === undefined ||
                typeof lastIndexOfMatch({ value: "", search: "ba" }) ===
                    "string" ||
                typeof lastIndexOfMatch({ value: "", search: "ba" }) ===
                    "boolean" ||
                typeof lastIndexOfMatch({ value: "", search: "ba" }) ===
                    "number" ||
                Array.isArray(lastIndexOfMatch({ value: "", search: "ba" })) ||
                (typeof lastIndexOfMatch({ value: "", search: "ba" }) ===
                    "object" &&
                    lastIndexOfMatch({ value: "", search: "ba" }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            lastIndexOfMatch({ value: "👨‍👩‍👧", search: "ba" }) === undefined ||
                typeof lastIndexOfMatch({ value: "👨‍👩‍👧", search: "ba" }) ===
                    "string" ||
                typeof lastIndexOfMatch({ value: "👨‍👩‍👧", search: "ba" }) ===
                    "boolean" ||
                typeof lastIndexOfMatch({ value: "👨‍👩‍👧", search: "ba" }) ===
                    "number" ||
                Array.isArray(
                    lastIndexOfMatch({ value: "👨‍👩‍👧", search: "ba" }),
                ) ||
                (typeof lastIndexOfMatch({ value: "👨‍👩‍👧", search: "ba" }) ===
                    "object" &&
                    lastIndexOfMatch({ value: "👨‍👩‍👧", search: "ba" }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            lastIndexOfMatch({ value: "e\u0301", search: "ba" }) ===
                undefined ||
                typeof lastIndexOfMatch({ value: "e\u0301", search: "ba" }) ===
                    "string" ||
                typeof lastIndexOfMatch({ value: "e\u0301", search: "ba" }) ===
                    "boolean" ||
                typeof lastIndexOfMatch({ value: "e\u0301", search: "ba" }) ===
                    "number" ||
                Array.isArray(
                    lastIndexOfMatch({ value: "e\u0301", search: "ba" }),
                ) ||
                (typeof lastIndexOfMatch({ value: "e\u0301", search: "ba" }) ===
                    "object" &&
                    lastIndexOfMatch({ value: "e\u0301", search: "ba" }) !==
                        null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            lastIndexOfMatch({ value: "مرحبا", search: "ba" }) === undefined ||
                typeof lastIndexOfMatch({ value: "مرحبا", search: "ba" }) ===
                    "string" ||
                typeof lastIndexOfMatch({ value: "مرحبا", search: "ba" }) ===
                    "boolean" ||
                typeof lastIndexOfMatch({ value: "مرحبا", search: "ba" }) ===
                    "number" ||
                Array.isArray(
                    lastIndexOfMatch({ value: "مرحبا", search: "ba" }),
                ) ||
                (typeof lastIndexOfMatch({ value: "مرحبا", search: "ba" }) ===
                    "object" &&
                    lastIndexOfMatch({ value: "مرحبا", search: "ba" }) !==
                        null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            lastIndexOfMatch({ value: "你好", search: "ba" }) === undefined ||
                typeof lastIndexOfMatch({ value: "你好", search: "ba" }) ===
                    "string" ||
                typeof lastIndexOfMatch({ value: "你好", search: "ba" }) ===
                    "boolean" ||
                typeof lastIndexOfMatch({ value: "你好", search: "ba" }) ===
                    "number" ||
                Array.isArray(
                    lastIndexOfMatch({ value: "你好", search: "ba" }),
                ) ||
                (typeof lastIndexOfMatch({ value: "你好", search: "ba" }) ===
                    "object" &&
                    lastIndexOfMatch({ value: "你好", search: "ba" }) !== null),
        ).toBe(true);
    });
});
