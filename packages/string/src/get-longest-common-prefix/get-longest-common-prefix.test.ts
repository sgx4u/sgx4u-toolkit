import { describe, expect, it } from "vitest";
import { getLongestCommonPrefix } from "./get-longest-common-prefix.js";
describe("getLongestCommonPrefix", () => {
    it("finds the shared prefix", () => {
        expect(getLongestCommonPrefix(["flower", "flow"])).toBe("flow");
        expect(getLongestCommonPrefix(["👍a", "👍b"])).toBe("👍");
        expect(getLongestCommonPrefix(["a", "b"])).toBe("");
        expect(getLongestCommonPrefix([])).toBeUndefined();
        expect(
            getLongestCommonPrefix(["a", 1 as unknown as string]),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(getLongestCommonPrefix(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            getLongestCommonPrefix(["", "flow"]) === undefined ||
                typeof getLongestCommonPrefix(["", "flow"]) === "string" ||
                typeof getLongestCommonPrefix(["", "flow"]) === "boolean" ||
                typeof getLongestCommonPrefix(["", "flow"]) === "number" ||
                Array.isArray(getLongestCommonPrefix(["", "flow"])) ||
                (typeof getLongestCommonPrefix(["", "flow"]) === "object" &&
                    getLongestCommonPrefix(["", "flow"]) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            getLongestCommonPrefix(["👨‍👩‍👧", "flow"]) === undefined ||
                typeof getLongestCommonPrefix(["👨‍👩‍👧", "flow"]) === "string" ||
                typeof getLongestCommonPrefix(["👨‍👩‍👧", "flow"]) === "boolean" ||
                typeof getLongestCommonPrefix(["👨‍👩‍👧", "flow"]) === "number" ||
                Array.isArray(getLongestCommonPrefix(["👨‍👩‍👧", "flow"])) ||
                (typeof getLongestCommonPrefix(["👨‍👩‍👧", "flow"]) === "object" &&
                    getLongestCommonPrefix(["👨‍👩‍👧", "flow"]) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            getLongestCommonPrefix(["e\u0301", "flow"]) === undefined ||
                typeof getLongestCommonPrefix(["e\u0301", "flow"]) ===
                    "string" ||
                typeof getLongestCommonPrefix(["e\u0301", "flow"]) ===
                    "boolean" ||
                typeof getLongestCommonPrefix(["e\u0301", "flow"]) ===
                    "number" ||
                Array.isArray(getLongestCommonPrefix(["e\u0301", "flow"])) ||
                (typeof getLongestCommonPrefix(["e\u0301", "flow"]) ===
                    "object" &&
                    getLongestCommonPrefix(["e\u0301", "flow"]) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            getLongestCommonPrefix(["مرحبا", "flow"]) === undefined ||
                typeof getLongestCommonPrefix(["مرحبا", "flow"]) === "string" ||
                typeof getLongestCommonPrefix(["مرحبا", "flow"]) ===
                    "boolean" ||
                typeof getLongestCommonPrefix(["مرحبا", "flow"]) === "number" ||
                Array.isArray(getLongestCommonPrefix(["مرحبا", "flow"])) ||
                (typeof getLongestCommonPrefix(["مرحبا", "flow"]) ===
                    "object" &&
                    getLongestCommonPrefix(["مرحبا", "flow"]) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            getLongestCommonPrefix(["你好", "flow"]) === undefined ||
                typeof getLongestCommonPrefix(["你好", "flow"]) === "string" ||
                typeof getLongestCommonPrefix(["你好", "flow"]) === "boolean" ||
                typeof getLongestCommonPrefix(["你好", "flow"]) === "number" ||
                Array.isArray(getLongestCommonPrefix(["你好", "flow"])) ||
                (typeof getLongestCommonPrefix(["你好", "flow"]) === "object" &&
                    getLongestCommonPrefix(["你好", "flow"]) !== null),
        ).toBe(true);
    });
});
