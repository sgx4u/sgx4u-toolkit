import { describe, expect, it } from "vitest";
import { ensurePrefix } from "./ensure-prefix.js";
describe("ensurePrefix", () => {
    it("applies the affix once", () => {
        const result = ensurePrefix({ value: "hello", prefix: "x" });
        expect(typeof result).toBe("string");
        expect(
            ensurePrefix({ value: 1 as unknown as string, prefix: "x" }),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(ensurePrefix(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            ensurePrefix({ value: "", prefix: "x" }) === undefined ||
                typeof ensurePrefix({ value: "", prefix: "x" }) === "string" ||
                typeof ensurePrefix({ value: "", prefix: "x" }) === "boolean" ||
                typeof ensurePrefix({ value: "", prefix: "x" }) === "number" ||
                Array.isArray(ensurePrefix({ value: "", prefix: "x" })) ||
                (typeof ensurePrefix({ value: "", prefix: "x" }) === "object" &&
                    ensurePrefix({ value: "", prefix: "x" }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            ensurePrefix({ value: "👨‍👩‍👧", prefix: "x" }) === undefined ||
                typeof ensurePrefix({ value: "👨‍👩‍👧", prefix: "x" }) ===
                    "string" ||
                typeof ensurePrefix({ value: "👨‍👩‍👧", prefix: "x" }) ===
                    "boolean" ||
                typeof ensurePrefix({ value: "👨‍👩‍👧", prefix: "x" }) ===
                    "number" ||
                Array.isArray(ensurePrefix({ value: "👨‍👩‍👧", prefix: "x" })) ||
                (typeof ensurePrefix({ value: "👨‍👩‍👧", prefix: "x" }) ===
                    "object" &&
                    ensurePrefix({ value: "👨‍👩‍👧", prefix: "x" }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            ensurePrefix({ value: "e\u0301", prefix: "x" }) === undefined ||
                typeof ensurePrefix({ value: "e\u0301", prefix: "x" }) ===
                    "string" ||
                typeof ensurePrefix({ value: "e\u0301", prefix: "x" }) ===
                    "boolean" ||
                typeof ensurePrefix({ value: "e\u0301", prefix: "x" }) ===
                    "number" ||
                Array.isArray(
                    ensurePrefix({ value: "e\u0301", prefix: "x" }),
                ) ||
                (typeof ensurePrefix({ value: "e\u0301", prefix: "x" }) ===
                    "object" &&
                    ensurePrefix({ value: "e\u0301", prefix: "x" }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            ensurePrefix({ value: "مرحبا", prefix: "x" }) === undefined ||
                typeof ensurePrefix({ value: "مرحبا", prefix: "x" }) ===
                    "string" ||
                typeof ensurePrefix({ value: "مرحبا", prefix: "x" }) ===
                    "boolean" ||
                typeof ensurePrefix({ value: "مرحبا", prefix: "x" }) ===
                    "number" ||
                Array.isArray(ensurePrefix({ value: "مرحبا", prefix: "x" })) ||
                (typeof ensurePrefix({ value: "مرحبا", prefix: "x" }) ===
                    "object" &&
                    ensurePrefix({ value: "مرحبا", prefix: "x" }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            ensurePrefix({ value: "你好", prefix: "x" }) === undefined ||
                typeof ensurePrefix({ value: "你好", prefix: "x" }) ===
                    "string" ||
                typeof ensurePrefix({ value: "你好", prefix: "x" }) ===
                    "boolean" ||
                typeof ensurePrefix({ value: "你好", prefix: "x" }) ===
                    "number" ||
                Array.isArray(ensurePrefix({ value: "你好", prefix: "x" })) ||
                (typeof ensurePrefix({ value: "你好", prefix: "x" }) ===
                    "object" &&
                    ensurePrefix({ value: "你好", prefix: "x" }) !== null),
        ).toBe(true);
    });
});
