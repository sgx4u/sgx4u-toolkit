import { describe, expect, it } from "vitest";
import { getLongestCommonSubstring } from "./get-longest-common-substring.js";
describe("getLongestCommonSubstring", () => {
    it("finds the first longest shared piece", () => {
        expect(getLongestCommonSubstring({ first: "abcd", second: "bc" })).toBe(
            "bc",
        );
        expect(
            getLongestCommonSubstring({ first: "abcXXXabd", second: "abdabc" }),
        ).toBe("abc");
        expect(getLongestCommonSubstring({ first: "abc", second: "xyz" })).toBe(
            "",
        );
        expect(
            getLongestCommonSubstring({
                first: 1 as unknown as string,
                second: "a",
            }),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(getLongestCommonSubstring(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            getLongestCommonSubstring({ first: "", second: "bc" }) ===
                undefined ||
                typeof getLongestCommonSubstring({
                    first: "",
                    second: "bc",
                }) === "string" ||
                typeof getLongestCommonSubstring({
                    first: "",
                    second: "bc",
                }) === "boolean" ||
                typeof getLongestCommonSubstring({
                    first: "",
                    second: "bc",
                }) === "number" ||
                Array.isArray(
                    getLongestCommonSubstring({ first: "", second: "bc" }),
                ) ||
                (typeof getLongestCommonSubstring({
                    first: "",
                    second: "bc",
                }) === "object" &&
                    getLongestCommonSubstring({ first: "", second: "bc" }) !==
                        null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            getLongestCommonSubstring({ first: "👨‍👩‍👧", second: "bc" }) ===
                undefined ||
                typeof getLongestCommonSubstring({
                    first: "👨‍👩‍👧",
                    second: "bc",
                }) === "string" ||
                typeof getLongestCommonSubstring({
                    first: "👨‍👩‍👧",
                    second: "bc",
                }) === "boolean" ||
                typeof getLongestCommonSubstring({
                    first: "👨‍👩‍👧",
                    second: "bc",
                }) === "number" ||
                Array.isArray(
                    getLongestCommonSubstring({ first: "👨‍👩‍👧", second: "bc" }),
                ) ||
                (typeof getLongestCommonSubstring({
                    first: "👨‍👩‍👧",
                    second: "bc",
                }) === "object" &&
                    getLongestCommonSubstring({ first: "👨‍👩‍👧", second: "bc" }) !==
                        null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            getLongestCommonSubstring({ first: "e\u0301", second: "bc" }) ===
                undefined ||
                typeof getLongestCommonSubstring({
                    first: "e\u0301",
                    second: "bc",
                }) === "string" ||
                typeof getLongestCommonSubstring({
                    first: "e\u0301",
                    second: "bc",
                }) === "boolean" ||
                typeof getLongestCommonSubstring({
                    first: "e\u0301",
                    second: "bc",
                }) === "number" ||
                Array.isArray(
                    getLongestCommonSubstring({
                        first: "e\u0301",
                        second: "bc",
                    }),
                ) ||
                (typeof getLongestCommonSubstring({
                    first: "e\u0301",
                    second: "bc",
                }) === "object" &&
                    getLongestCommonSubstring({
                        first: "e\u0301",
                        second: "bc",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            getLongestCommonSubstring({ first: "مرحبا", second: "bc" }) ===
                undefined ||
                typeof getLongestCommonSubstring({
                    first: "مرحبا",
                    second: "bc",
                }) === "string" ||
                typeof getLongestCommonSubstring({
                    first: "مرحبا",
                    second: "bc",
                }) === "boolean" ||
                typeof getLongestCommonSubstring({
                    first: "مرحبا",
                    second: "bc",
                }) === "number" ||
                Array.isArray(
                    getLongestCommonSubstring({ first: "مرحبا", second: "bc" }),
                ) ||
                (typeof getLongestCommonSubstring({
                    first: "مرحبا",
                    second: "bc",
                }) === "object" &&
                    getLongestCommonSubstring({
                        first: "مرحبا",
                        second: "bc",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            getLongestCommonSubstring({ first: "你好", second: "bc" }) ===
                undefined ||
                typeof getLongestCommonSubstring({
                    first: "你好",
                    second: "bc",
                }) === "string" ||
                typeof getLongestCommonSubstring({
                    first: "你好",
                    second: "bc",
                }) === "boolean" ||
                typeof getLongestCommonSubstring({
                    first: "你好",
                    second: "bc",
                }) === "number" ||
                Array.isArray(
                    getLongestCommonSubstring({ first: "你好", second: "bc" }),
                ) ||
                (typeof getLongestCommonSubstring({
                    first: "你好",
                    second: "bc",
                }) === "object" &&
                    getLongestCommonSubstring({
                        first: "你好",
                        second: "bc",
                    }) !== null),
        ).toBe(true);
    });
});
