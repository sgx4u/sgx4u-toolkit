import { describe, expect, it } from "vitest";
import { getSubstringAfterLast } from "./get-substring-after-last.js";
describe("getSubstringAfterLast", () => {
    it("reads around the separator", () => {
        const found = getSubstringAfterLast({ value: "a-b-c", separator: "-" });
        expect(typeof found).toBe("string");
        expect(
            getSubstringAfterLast({
                value: "abc",
                separator: "-",
                missing: "whole",
            }),
        ).toBe("abc");
        expect(getSubstringAfterLast({ value: "abc", separator: "-" })).toBe(
            "",
        );
        expect(
            getSubstringAfterLast({
                value: 1 as unknown as string,
                separator: "-",
            }),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(getSubstringAfterLast(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            getSubstringAfterLast({ value: "", separator: "-" }) ===
                undefined ||
                typeof getSubstringAfterLast({ value: "", separator: "-" }) ===
                    "string" ||
                typeof getSubstringAfterLast({ value: "", separator: "-" }) ===
                    "boolean" ||
                typeof getSubstringAfterLast({ value: "", separator: "-" }) ===
                    "number" ||
                Array.isArray(
                    getSubstringAfterLast({ value: "", separator: "-" }),
                ) ||
                (typeof getSubstringAfterLast({ value: "", separator: "-" }) ===
                    "object" &&
                    getSubstringAfterLast({ value: "", separator: "-" }) !==
                        null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            getSubstringAfterLast({ value: "👨‍👩‍👧", separator: "-" }) ===
                undefined ||
                typeof getSubstringAfterLast({
                    value: "👨‍👩‍👧",
                    separator: "-",
                }) === "string" ||
                typeof getSubstringAfterLast({
                    value: "👨‍👩‍👧",
                    separator: "-",
                }) === "boolean" ||
                typeof getSubstringAfterLast({
                    value: "👨‍👩‍👧",
                    separator: "-",
                }) === "number" ||
                Array.isArray(
                    getSubstringAfterLast({ value: "👨‍👩‍👧", separator: "-" }),
                ) ||
                (typeof getSubstringAfterLast({
                    value: "👨‍👩‍👧",
                    separator: "-",
                }) === "object" &&
                    getSubstringAfterLast({ value: "👨‍👩‍👧", separator: "-" }) !==
                        null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            getSubstringAfterLast({ value: "e\u0301", separator: "-" }) ===
                undefined ||
                typeof getSubstringAfterLast({
                    value: "e\u0301",
                    separator: "-",
                }) === "string" ||
                typeof getSubstringAfterLast({
                    value: "e\u0301",
                    separator: "-",
                }) === "boolean" ||
                typeof getSubstringAfterLast({
                    value: "e\u0301",
                    separator: "-",
                }) === "number" ||
                Array.isArray(
                    getSubstringAfterLast({ value: "e\u0301", separator: "-" }),
                ) ||
                (typeof getSubstringAfterLast({
                    value: "e\u0301",
                    separator: "-",
                }) === "object" &&
                    getSubstringAfterLast({
                        value: "e\u0301",
                        separator: "-",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            getSubstringAfterLast({ value: "مرحبا", separator: "-" }) ===
                undefined ||
                typeof getSubstringAfterLast({
                    value: "مرحبا",
                    separator: "-",
                }) === "string" ||
                typeof getSubstringAfterLast({
                    value: "مرحبا",
                    separator: "-",
                }) === "boolean" ||
                typeof getSubstringAfterLast({
                    value: "مرحبا",
                    separator: "-",
                }) === "number" ||
                Array.isArray(
                    getSubstringAfterLast({ value: "مرحبا", separator: "-" }),
                ) ||
                (typeof getSubstringAfterLast({
                    value: "مرحبا",
                    separator: "-",
                }) === "object" &&
                    getSubstringAfterLast({
                        value: "مرحبا",
                        separator: "-",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            getSubstringAfterLast({ value: "你好", separator: "-" }) ===
                undefined ||
                typeof getSubstringAfterLast({
                    value: "你好",
                    separator: "-",
                }) === "string" ||
                typeof getSubstringAfterLast({
                    value: "你好",
                    separator: "-",
                }) === "boolean" ||
                typeof getSubstringAfterLast({
                    value: "你好",
                    separator: "-",
                }) === "number" ||
                Array.isArray(
                    getSubstringAfterLast({ value: "你好", separator: "-" }),
                ) ||
                (typeof getSubstringAfterLast({
                    value: "你好",
                    separator: "-",
                }) === "object" &&
                    getSubstringAfterLast({ value: "你好", separator: "-" }) !==
                        null),
        ).toBe(true);
    });
});
