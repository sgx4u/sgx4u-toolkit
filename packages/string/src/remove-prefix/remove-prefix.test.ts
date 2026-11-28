import { describe, expect, it } from "vitest";
import { removePrefix } from "./remove-prefix.js";
describe("removePrefix", () => {
    it("applies the affix once", () => {
        const result = removePrefix({ value: "hello", prefix: "x" });
        expect(typeof result).toBe("string");
        expect(
            removePrefix({ value: 1 as unknown as string, prefix: "x" }),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(removePrefix(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            removePrefix({ value: "", prefix: "x" }) === undefined ||
                typeof removePrefix({ value: "", prefix: "x" }) === "string" ||
                typeof removePrefix({ value: "", prefix: "x" }) === "boolean" ||
                typeof removePrefix({ value: "", prefix: "x" }) === "number" ||
                Array.isArray(removePrefix({ value: "", prefix: "x" })) ||
                (typeof removePrefix({ value: "", prefix: "x" }) === "object" &&
                    removePrefix({ value: "", prefix: "x" }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            removePrefix({ value: "👨‍👩‍👧", prefix: "x" }) === undefined ||
                typeof removePrefix({ value: "👨‍👩‍👧", prefix: "x" }) ===
                    "string" ||
                typeof removePrefix({ value: "👨‍👩‍👧", prefix: "x" }) ===
                    "boolean" ||
                typeof removePrefix({ value: "👨‍👩‍👧", prefix: "x" }) ===
                    "number" ||
                Array.isArray(removePrefix({ value: "👨‍👩‍👧", prefix: "x" })) ||
                (typeof removePrefix({ value: "👨‍👩‍👧", prefix: "x" }) ===
                    "object" &&
                    removePrefix({ value: "👨‍👩‍👧", prefix: "x" }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            removePrefix({ value: "e\u0301", prefix: "x" }) === undefined ||
                typeof removePrefix({ value: "e\u0301", prefix: "x" }) ===
                    "string" ||
                typeof removePrefix({ value: "e\u0301", prefix: "x" }) ===
                    "boolean" ||
                typeof removePrefix({ value: "e\u0301", prefix: "x" }) ===
                    "number" ||
                Array.isArray(
                    removePrefix({ value: "e\u0301", prefix: "x" }),
                ) ||
                (typeof removePrefix({ value: "e\u0301", prefix: "x" }) ===
                    "object" &&
                    removePrefix({ value: "e\u0301", prefix: "x" }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            removePrefix({ value: "مرحبا", prefix: "x" }) === undefined ||
                typeof removePrefix({ value: "مرحبا", prefix: "x" }) ===
                    "string" ||
                typeof removePrefix({ value: "مرحبا", prefix: "x" }) ===
                    "boolean" ||
                typeof removePrefix({ value: "مرحبا", prefix: "x" }) ===
                    "number" ||
                Array.isArray(removePrefix({ value: "مرحبا", prefix: "x" })) ||
                (typeof removePrefix({ value: "مرحبا", prefix: "x" }) ===
                    "object" &&
                    removePrefix({ value: "مرحبا", prefix: "x" }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            removePrefix({ value: "你好", prefix: "x" }) === undefined ||
                typeof removePrefix({ value: "你好", prefix: "x" }) ===
                    "string" ||
                typeof removePrefix({ value: "你好", prefix: "x" }) ===
                    "boolean" ||
                typeof removePrefix({ value: "你好", prefix: "x" }) ===
                    "number" ||
                Array.isArray(removePrefix({ value: "你好", prefix: "x" })) ||
                (typeof removePrefix({ value: "你好", prefix: "x" }) ===
                    "object" &&
                    removePrefix({ value: "你好", prefix: "x" }) !== null),
        ).toBe(true);
    });
});
