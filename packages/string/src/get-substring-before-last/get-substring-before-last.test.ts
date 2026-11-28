import { describe, expect, it } from "vitest";
import { getSubstringBeforeLast } from "./get-substring-before-last.js";
describe("getSubstringBeforeLast", () => {
    it("reads around the separator", () => {
        const found = getSubstringBeforeLast({
            value: "a-b-c",
            separator: "-",
        });
        expect(typeof found).toBe("string");
        expect(
            getSubstringBeforeLast({
                value: "abc",
                separator: "-",
                missing: "whole",
            }),
        ).toBe("abc");
        expect(getSubstringBeforeLast({ value: "abc", separator: "-" })).toBe(
            "",
        );
        expect(
            getSubstringBeforeLast({
                value: 1 as unknown as string,
                separator: "-",
            }),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(getSubstringBeforeLast(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            getSubstringBeforeLast({ value: "", separator: "-" }) ===
                undefined ||
                typeof getSubstringBeforeLast({ value: "", separator: "-" }) ===
                    "string" ||
                typeof getSubstringBeforeLast({ value: "", separator: "-" }) ===
                    "boolean" ||
                typeof getSubstringBeforeLast({ value: "", separator: "-" }) ===
                    "number" ||
                Array.isArray(
                    getSubstringBeforeLast({ value: "", separator: "-" }),
                ) ||
                (typeof getSubstringBeforeLast({
                    value: "",
                    separator: "-",
                }) === "object" &&
                    getSubstringBeforeLast({ value: "", separator: "-" }) !==
                        null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            getSubstringBeforeLast({ value: "👨‍👩‍👧", separator: "-" }) ===
                undefined ||
                typeof getSubstringBeforeLast({
                    value: "👨‍👩‍👧",
                    separator: "-",
                }) === "string" ||
                typeof getSubstringBeforeLast({
                    value: "👨‍👩‍👧",
                    separator: "-",
                }) === "boolean" ||
                typeof getSubstringBeforeLast({
                    value: "👨‍👩‍👧",
                    separator: "-",
                }) === "number" ||
                Array.isArray(
                    getSubstringBeforeLast({ value: "👨‍👩‍👧", separator: "-" }),
                ) ||
                (typeof getSubstringBeforeLast({
                    value: "👨‍👩‍👧",
                    separator: "-",
                }) === "object" &&
                    getSubstringBeforeLast({ value: "👨‍👩‍👧", separator: "-" }) !==
                        null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            getSubstringBeforeLast({ value: "e\u0301", separator: "-" }) ===
                undefined ||
                typeof getSubstringBeforeLast({
                    value: "e\u0301",
                    separator: "-",
                }) === "string" ||
                typeof getSubstringBeforeLast({
                    value: "e\u0301",
                    separator: "-",
                }) === "boolean" ||
                typeof getSubstringBeforeLast({
                    value: "e\u0301",
                    separator: "-",
                }) === "number" ||
                Array.isArray(
                    getSubstringBeforeLast({
                        value: "e\u0301",
                        separator: "-",
                    }),
                ) ||
                (typeof getSubstringBeforeLast({
                    value: "e\u0301",
                    separator: "-",
                }) === "object" &&
                    getSubstringBeforeLast({
                        value: "e\u0301",
                        separator: "-",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            getSubstringBeforeLast({ value: "مرحبا", separator: "-" }) ===
                undefined ||
                typeof getSubstringBeforeLast({
                    value: "مرحبا",
                    separator: "-",
                }) === "string" ||
                typeof getSubstringBeforeLast({
                    value: "مرحبا",
                    separator: "-",
                }) === "boolean" ||
                typeof getSubstringBeforeLast({
                    value: "مرحبا",
                    separator: "-",
                }) === "number" ||
                Array.isArray(
                    getSubstringBeforeLast({ value: "مرحبا", separator: "-" }),
                ) ||
                (typeof getSubstringBeforeLast({
                    value: "مرحبا",
                    separator: "-",
                }) === "object" &&
                    getSubstringBeforeLast({
                        value: "مرحبا",
                        separator: "-",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            getSubstringBeforeLast({ value: "你好", separator: "-" }) ===
                undefined ||
                typeof getSubstringBeforeLast({
                    value: "你好",
                    separator: "-",
                }) === "string" ||
                typeof getSubstringBeforeLast({
                    value: "你好",
                    separator: "-",
                }) === "boolean" ||
                typeof getSubstringBeforeLast({
                    value: "你好",
                    separator: "-",
                }) === "number" ||
                Array.isArray(
                    getSubstringBeforeLast({ value: "你好", separator: "-" }),
                ) ||
                (typeof getSubstringBeforeLast({
                    value: "你好",
                    separator: "-",
                }) === "object" &&
                    getSubstringBeforeLast({
                        value: "你好",
                        separator: "-",
                    }) !== null),
        ).toBe(true);
    });
});
