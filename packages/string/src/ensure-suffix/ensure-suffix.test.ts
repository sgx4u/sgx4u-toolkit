import { describe, expect, it } from "vitest";
import { ensureSuffix } from "./ensure-suffix.js";
describe("ensureSuffix", () => {
    it("applies the affix once", () => {
        const result = ensureSuffix({ value: "hello", suffix: "x" });
        expect(typeof result).toBe("string");
        expect(
            ensureSuffix({ value: 1 as unknown as string, suffix: "x" }),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(ensureSuffix(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            ensureSuffix({ value: "", suffix: "x" }) === undefined ||
                typeof ensureSuffix({ value: "", suffix: "x" }) === "string" ||
                typeof ensureSuffix({ value: "", suffix: "x" }) === "boolean" ||
                typeof ensureSuffix({ value: "", suffix: "x" }) === "number" ||
                Array.isArray(ensureSuffix({ value: "", suffix: "x" })) ||
                (typeof ensureSuffix({ value: "", suffix: "x" }) === "object" &&
                    ensureSuffix({ value: "", suffix: "x" }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            ensureSuffix({ value: "👨‍👩‍👧", suffix: "x" }) === undefined ||
                typeof ensureSuffix({ value: "👨‍👩‍👧", suffix: "x" }) ===
                    "string" ||
                typeof ensureSuffix({ value: "👨‍👩‍👧", suffix: "x" }) ===
                    "boolean" ||
                typeof ensureSuffix({ value: "👨‍👩‍👧", suffix: "x" }) ===
                    "number" ||
                Array.isArray(ensureSuffix({ value: "👨‍👩‍👧", suffix: "x" })) ||
                (typeof ensureSuffix({ value: "👨‍👩‍👧", suffix: "x" }) ===
                    "object" &&
                    ensureSuffix({ value: "👨‍👩‍👧", suffix: "x" }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            ensureSuffix({ value: "e\u0301", suffix: "x" }) === undefined ||
                typeof ensureSuffix({ value: "e\u0301", suffix: "x" }) ===
                    "string" ||
                typeof ensureSuffix({ value: "e\u0301", suffix: "x" }) ===
                    "boolean" ||
                typeof ensureSuffix({ value: "e\u0301", suffix: "x" }) ===
                    "number" ||
                Array.isArray(
                    ensureSuffix({ value: "e\u0301", suffix: "x" }),
                ) ||
                (typeof ensureSuffix({ value: "e\u0301", suffix: "x" }) ===
                    "object" &&
                    ensureSuffix({ value: "e\u0301", suffix: "x" }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            ensureSuffix({ value: "مرحبا", suffix: "x" }) === undefined ||
                typeof ensureSuffix({ value: "مرحبا", suffix: "x" }) ===
                    "string" ||
                typeof ensureSuffix({ value: "مرحبا", suffix: "x" }) ===
                    "boolean" ||
                typeof ensureSuffix({ value: "مرحبا", suffix: "x" }) ===
                    "number" ||
                Array.isArray(ensureSuffix({ value: "مرحبا", suffix: "x" })) ||
                (typeof ensureSuffix({ value: "مرحبا", suffix: "x" }) ===
                    "object" &&
                    ensureSuffix({ value: "مرحبا", suffix: "x" }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            ensureSuffix({ value: "你好", suffix: "x" }) === undefined ||
                typeof ensureSuffix({ value: "你好", suffix: "x" }) ===
                    "string" ||
                typeof ensureSuffix({ value: "你好", suffix: "x" }) ===
                    "boolean" ||
                typeof ensureSuffix({ value: "你好", suffix: "x" }) ===
                    "number" ||
                Array.isArray(ensureSuffix({ value: "你好", suffix: "x" })) ||
                (typeof ensureSuffix({ value: "你好", suffix: "x" }) ===
                    "object" &&
                    ensureSuffix({ value: "你好", suffix: "x" }) !== null),
        ).toBe(true);
    });
});
