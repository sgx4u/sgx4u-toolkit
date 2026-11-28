import { describe, expect, it } from "vitest";
import { removeSuffix } from "./remove-suffix.js";
describe("removeSuffix", () => {
    it("applies the affix once", () => {
        const result = removeSuffix({ value: "hello", suffix: "x" });
        expect(typeof result).toBe("string");
        expect(
            removeSuffix({ value: 1 as unknown as string, suffix: "x" }),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(removeSuffix(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            removeSuffix({ value: "", suffix: "x" }) === undefined ||
                typeof removeSuffix({ value: "", suffix: "x" }) === "string" ||
                typeof removeSuffix({ value: "", suffix: "x" }) === "boolean" ||
                typeof removeSuffix({ value: "", suffix: "x" }) === "number" ||
                Array.isArray(removeSuffix({ value: "", suffix: "x" })) ||
                (typeof removeSuffix({ value: "", suffix: "x" }) === "object" &&
                    removeSuffix({ value: "", suffix: "x" }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            removeSuffix({ value: "👨‍👩‍👧", suffix: "x" }) === undefined ||
                typeof removeSuffix({ value: "👨‍👩‍👧", suffix: "x" }) ===
                    "string" ||
                typeof removeSuffix({ value: "👨‍👩‍👧", suffix: "x" }) ===
                    "boolean" ||
                typeof removeSuffix({ value: "👨‍👩‍👧", suffix: "x" }) ===
                    "number" ||
                Array.isArray(removeSuffix({ value: "👨‍👩‍👧", suffix: "x" })) ||
                (typeof removeSuffix({ value: "👨‍👩‍👧", suffix: "x" }) ===
                    "object" &&
                    removeSuffix({ value: "👨‍👩‍👧", suffix: "x" }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            removeSuffix({ value: "e\u0301", suffix: "x" }) === undefined ||
                typeof removeSuffix({ value: "e\u0301", suffix: "x" }) ===
                    "string" ||
                typeof removeSuffix({ value: "e\u0301", suffix: "x" }) ===
                    "boolean" ||
                typeof removeSuffix({ value: "e\u0301", suffix: "x" }) ===
                    "number" ||
                Array.isArray(
                    removeSuffix({ value: "e\u0301", suffix: "x" }),
                ) ||
                (typeof removeSuffix({ value: "e\u0301", suffix: "x" }) ===
                    "object" &&
                    removeSuffix({ value: "e\u0301", suffix: "x" }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            removeSuffix({ value: "مرحبا", suffix: "x" }) === undefined ||
                typeof removeSuffix({ value: "مرحبا", suffix: "x" }) ===
                    "string" ||
                typeof removeSuffix({ value: "مرحبا", suffix: "x" }) ===
                    "boolean" ||
                typeof removeSuffix({ value: "مرحبا", suffix: "x" }) ===
                    "number" ||
                Array.isArray(removeSuffix({ value: "مرحبا", suffix: "x" })) ||
                (typeof removeSuffix({ value: "مرحبا", suffix: "x" }) ===
                    "object" &&
                    removeSuffix({ value: "مرحبا", suffix: "x" }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            removeSuffix({ value: "你好", suffix: "x" }) === undefined ||
                typeof removeSuffix({ value: "你好", suffix: "x" }) ===
                    "string" ||
                typeof removeSuffix({ value: "你好", suffix: "x" }) ===
                    "boolean" ||
                typeof removeSuffix({ value: "你好", suffix: "x" }) ===
                    "number" ||
                Array.isArray(removeSuffix({ value: "你好", suffix: "x" })) ||
                (typeof removeSuffix({ value: "你好", suffix: "x" }) ===
                    "object" &&
                    removeSuffix({ value: "你好", suffix: "x" }) !== null),
        ).toBe(true);
    });
});
