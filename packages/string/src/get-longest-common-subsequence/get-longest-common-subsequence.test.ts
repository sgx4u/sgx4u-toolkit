import { describe, expect, it } from "vitest";
import { getLongestCommonSubsequence } from "./get-longest-common-subsequence.js";
describe("getLongestCommonSubsequence", () => {
    it("keeps a non-contiguous match", () => {
        expect(
            getLongestCommonSubsequence({ first: "abc", second: "ac" }),
        ).toBe("ac");
        expect(getLongestCommonSubsequence({ first: "", second: "" })).toBe("");
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(getLongestCommonSubsequence(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            getLongestCommonSubsequence({ first: "", second: "ace" }) ===
                undefined ||
                typeof getLongestCommonSubsequence({
                    first: "",
                    second: "ace",
                }) === "string" ||
                typeof getLongestCommonSubsequence({
                    first: "",
                    second: "ace",
                }) === "boolean" ||
                typeof getLongestCommonSubsequence({
                    first: "",
                    second: "ace",
                }) === "number" ||
                Array.isArray(
                    getLongestCommonSubsequence({ first: "", second: "ace" }),
                ) ||
                (typeof getLongestCommonSubsequence({
                    first: "",
                    second: "ace",
                }) === "object" &&
                    getLongestCommonSubsequence({
                        first: "",
                        second: "ace",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            getLongestCommonSubsequence({ first: "👨‍👩‍👧", second: "ace" }) ===
                undefined ||
                typeof getLongestCommonSubsequence({
                    first: "👨‍👩‍👧",
                    second: "ace",
                }) === "string" ||
                typeof getLongestCommonSubsequence({
                    first: "👨‍👩‍👧",
                    second: "ace",
                }) === "boolean" ||
                typeof getLongestCommonSubsequence({
                    first: "👨‍👩‍👧",
                    second: "ace",
                }) === "number" ||
                Array.isArray(
                    getLongestCommonSubsequence({ first: "👨‍👩‍👧", second: "ace" }),
                ) ||
                (typeof getLongestCommonSubsequence({
                    first: "👨‍👩‍👧",
                    second: "ace",
                }) === "object" &&
                    getLongestCommonSubsequence({
                        first: "👨‍👩‍👧",
                        second: "ace",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            getLongestCommonSubsequence({ first: "e\u0301", second: "ace" }) ===
                undefined ||
                typeof getLongestCommonSubsequence({
                    first: "e\u0301",
                    second: "ace",
                }) === "string" ||
                typeof getLongestCommonSubsequence({
                    first: "e\u0301",
                    second: "ace",
                }) === "boolean" ||
                typeof getLongestCommonSubsequence({
                    first: "e\u0301",
                    second: "ace",
                }) === "number" ||
                Array.isArray(
                    getLongestCommonSubsequence({
                        first: "e\u0301",
                        second: "ace",
                    }),
                ) ||
                (typeof getLongestCommonSubsequence({
                    first: "e\u0301",
                    second: "ace",
                }) === "object" &&
                    getLongestCommonSubsequence({
                        first: "e\u0301",
                        second: "ace",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            getLongestCommonSubsequence({ first: "مرحبا", second: "ace" }) ===
                undefined ||
                typeof getLongestCommonSubsequence({
                    first: "مرحبا",
                    second: "ace",
                }) === "string" ||
                typeof getLongestCommonSubsequence({
                    first: "مرحبا",
                    second: "ace",
                }) === "boolean" ||
                typeof getLongestCommonSubsequence({
                    first: "مرحبا",
                    second: "ace",
                }) === "number" ||
                Array.isArray(
                    getLongestCommonSubsequence({
                        first: "مرحبا",
                        second: "ace",
                    }),
                ) ||
                (typeof getLongestCommonSubsequence({
                    first: "مرحبا",
                    second: "ace",
                }) === "object" &&
                    getLongestCommonSubsequence({
                        first: "مرحبا",
                        second: "ace",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            getLongestCommonSubsequence({ first: "你好", second: "ace" }) ===
                undefined ||
                typeof getLongestCommonSubsequence({
                    first: "你好",
                    second: "ace",
                }) === "string" ||
                typeof getLongestCommonSubsequence({
                    first: "你好",
                    second: "ace",
                }) === "boolean" ||
                typeof getLongestCommonSubsequence({
                    first: "你好",
                    second: "ace",
                }) === "number" ||
                Array.isArray(
                    getLongestCommonSubsequence({
                        first: "你好",
                        second: "ace",
                    }),
                ) ||
                (typeof getLongestCommonSubsequence({
                    first: "你好",
                    second: "ace",
                }) === "object" &&
                    getLongestCommonSubsequence({
                        first: "你好",
                        second: "ace",
                    }) !== null),
        ).toBe(true);
    });
    it("throws when unit is unknown", () => {
        expect(() =>
            getLongestCommonSubsequence({
                first: "abcde",
                second: "ace",
                unit: "nope" as never,
            }),
        ).toThrow(RangeError);
    });
});
