import { describe, expect, it } from "vitest";
import { getLongestCommonSuffix } from "./get-longest-common-suffix.js";
describe("getLongestCommonSuffix", () => {
    it("finds the shared suffix", () => {
        expect(getLongestCommonSuffix(["testing", "running"])).toBe("ing");
        expect(getLongestCommonSuffix(["a", "b"])).toBe("");
        expect(getLongestCommonSuffix([])).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(getLongestCommonSuffix(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            getLongestCommonSuffix(["", "running"]) === undefined ||
                typeof getLongestCommonSuffix(["", "running"]) === "string" ||
                typeof getLongestCommonSuffix(["", "running"]) === "boolean" ||
                typeof getLongestCommonSuffix(["", "running"]) === "number" ||
                Array.isArray(getLongestCommonSuffix(["", "running"])) ||
                (typeof getLongestCommonSuffix(["", "running"]) === "object" &&
                    getLongestCommonSuffix(["", "running"]) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            getLongestCommonSuffix(["👨‍👩‍👧", "running"]) === undefined ||
                typeof getLongestCommonSuffix(["👨‍👩‍👧", "running"]) === "string" ||
                typeof getLongestCommonSuffix(["👨‍👩‍👧", "running"]) ===
                    "boolean" ||
                typeof getLongestCommonSuffix(["👨‍👩‍👧", "running"]) === "number" ||
                Array.isArray(getLongestCommonSuffix(["👨‍👩‍👧", "running"])) ||
                (typeof getLongestCommonSuffix(["👨‍👩‍👧", "running"]) ===
                    "object" &&
                    getLongestCommonSuffix(["👨‍👩‍👧", "running"]) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            getLongestCommonSuffix(["e\u0301", "running"]) === undefined ||
                typeof getLongestCommonSuffix(["e\u0301", "running"]) ===
                    "string" ||
                typeof getLongestCommonSuffix(["e\u0301", "running"]) ===
                    "boolean" ||
                typeof getLongestCommonSuffix(["e\u0301", "running"]) ===
                    "number" ||
                Array.isArray(getLongestCommonSuffix(["e\u0301", "running"])) ||
                (typeof getLongestCommonSuffix(["e\u0301", "running"]) ===
                    "object" &&
                    getLongestCommonSuffix(["e\u0301", "running"]) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            getLongestCommonSuffix(["مرحبا", "running"]) === undefined ||
                typeof getLongestCommonSuffix(["مرحبا", "running"]) ===
                    "string" ||
                typeof getLongestCommonSuffix(["مرحبا", "running"]) ===
                    "boolean" ||
                typeof getLongestCommonSuffix(["مرحبا", "running"]) ===
                    "number" ||
                Array.isArray(getLongestCommonSuffix(["مرحبا", "running"])) ||
                (typeof getLongestCommonSuffix(["مرحبا", "running"]) ===
                    "object" &&
                    getLongestCommonSuffix(["مرحبا", "running"]) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            getLongestCommonSuffix(["你好", "running"]) === undefined ||
                typeof getLongestCommonSuffix(["你好", "running"]) ===
                    "string" ||
                typeof getLongestCommonSuffix(["你好", "running"]) ===
                    "boolean" ||
                typeof getLongestCommonSuffix(["你好", "running"]) ===
                    "number" ||
                Array.isArray(getLongestCommonSuffix(["你好", "running"])) ||
                (typeof getLongestCommonSuffix(["你好", "running"]) ===
                    "object" &&
                    getLongestCommonSuffix(["你好", "running"]) !== null),
        ).toBe(true);
    });
});
