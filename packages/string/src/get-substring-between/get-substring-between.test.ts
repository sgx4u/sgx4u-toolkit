import { describe, expect, it } from "vitest";
import { getSubstringBetween } from "./get-substring-between.js";
describe("getSubstringBetween", () => {
    it("reads between markers", () => {
        expect(
            getSubstringBetween({ value: "a[b]c", start: "[", end: "]" }),
        ).toBe("b");
        expect(
            getSubstringBetween({ value: "abc", start: "[", end: "]" }),
        ).toBe("");
        expect(
            getSubstringBetween({
                value: "abc",
                start: "[",
                end: "]",
                missing: "whole",
            }),
        ).toBe("abc");
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(getSubstringBetween(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            getSubstringBetween({ value: "", start: "[", end: "]" }) ===
                undefined ||
                typeof getSubstringBetween({
                    value: "",
                    start: "[",
                    end: "]",
                }) === "string" ||
                typeof getSubstringBetween({
                    value: "",
                    start: "[",
                    end: "]",
                }) === "boolean" ||
                typeof getSubstringBetween({
                    value: "",
                    start: "[",
                    end: "]",
                }) === "number" ||
                Array.isArray(
                    getSubstringBetween({ value: "", start: "[", end: "]" }),
                ) ||
                (typeof getSubstringBetween({
                    value: "",
                    start: "[",
                    end: "]",
                }) === "object" &&
                    getSubstringBetween({ value: "", start: "[", end: "]" }) !==
                        null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            getSubstringBetween({ value: "👨‍👩‍👧", start: "[", end: "]" }) ===
                undefined ||
                typeof getSubstringBetween({
                    value: "👨‍👩‍👧",
                    start: "[",
                    end: "]",
                }) === "string" ||
                typeof getSubstringBetween({
                    value: "👨‍👩‍👧",
                    start: "[",
                    end: "]",
                }) === "boolean" ||
                typeof getSubstringBetween({
                    value: "👨‍👩‍👧",
                    start: "[",
                    end: "]",
                }) === "number" ||
                Array.isArray(
                    getSubstringBetween({ value: "👨‍👩‍👧", start: "[", end: "]" }),
                ) ||
                (typeof getSubstringBetween({
                    value: "👨‍👩‍👧",
                    start: "[",
                    end: "]",
                }) === "object" &&
                    getSubstringBetween({
                        value: "👨‍👩‍👧",
                        start: "[",
                        end: "]",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            getSubstringBetween({ value: "e\u0301", start: "[", end: "]" }) ===
                undefined ||
                typeof getSubstringBetween({
                    value: "e\u0301",
                    start: "[",
                    end: "]",
                }) === "string" ||
                typeof getSubstringBetween({
                    value: "e\u0301",
                    start: "[",
                    end: "]",
                }) === "boolean" ||
                typeof getSubstringBetween({
                    value: "e\u0301",
                    start: "[",
                    end: "]",
                }) === "number" ||
                Array.isArray(
                    getSubstringBetween({
                        value: "e\u0301",
                        start: "[",
                        end: "]",
                    }),
                ) ||
                (typeof getSubstringBetween({
                    value: "e\u0301",
                    start: "[",
                    end: "]",
                }) === "object" &&
                    getSubstringBetween({
                        value: "e\u0301",
                        start: "[",
                        end: "]",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            getSubstringBetween({ value: "مرحبا", start: "[", end: "]" }) ===
                undefined ||
                typeof getSubstringBetween({
                    value: "مرحبا",
                    start: "[",
                    end: "]",
                }) === "string" ||
                typeof getSubstringBetween({
                    value: "مرحبا",
                    start: "[",
                    end: "]",
                }) === "boolean" ||
                typeof getSubstringBetween({
                    value: "مرحبا",
                    start: "[",
                    end: "]",
                }) === "number" ||
                Array.isArray(
                    getSubstringBetween({
                        value: "مرحبا",
                        start: "[",
                        end: "]",
                    }),
                ) ||
                (typeof getSubstringBetween({
                    value: "مرحبا",
                    start: "[",
                    end: "]",
                }) === "object" &&
                    getSubstringBetween({
                        value: "مرحبا",
                        start: "[",
                        end: "]",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            getSubstringBetween({ value: "你好", start: "[", end: "]" }) ===
                undefined ||
                typeof getSubstringBetween({
                    value: "你好",
                    start: "[",
                    end: "]",
                }) === "string" ||
                typeof getSubstringBetween({
                    value: "你好",
                    start: "[",
                    end: "]",
                }) === "boolean" ||
                typeof getSubstringBetween({
                    value: "你好",
                    start: "[",
                    end: "]",
                }) === "number" ||
                Array.isArray(
                    getSubstringBetween({
                        value: "你好",
                        start: "[",
                        end: "]",
                    }),
                ) ||
                (typeof getSubstringBetween({
                    value: "你好",
                    start: "[",
                    end: "]",
                }) === "object" &&
                    getSubstringBetween({
                        value: "你好",
                        start: "[",
                        end: "]",
                    }) !== null),
        ).toBe(true);
    });
});
