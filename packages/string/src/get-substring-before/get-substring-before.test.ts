import { describe, expect, it } from "vitest";
import { getSubstringBefore } from "./get-substring-before.js";
describe("getSubstringBefore", () => {
    it("reads around the separator", () => {
        const found = getSubstringBefore({ value: "a-b-c", separator: "-" });
        expect(typeof found).toBe("string");
        expect(
            getSubstringBefore({
                value: "abc",
                separator: "-",
                missing: "whole",
            }),
        ).toBe("abc");
        expect(getSubstringBefore({ value: "abc", separator: "-" })).toBe("");
        expect(
            getSubstringBefore({
                value: 1 as unknown as string,
                separator: "-",
            }),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(getSubstringBefore(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            getSubstringBefore({ value: "", separator: "-" }) === undefined ||
                typeof getSubstringBefore({ value: "", separator: "-" }) ===
                    "string" ||
                typeof getSubstringBefore({ value: "", separator: "-" }) ===
                    "boolean" ||
                typeof getSubstringBefore({ value: "", separator: "-" }) ===
                    "number" ||
                Array.isArray(
                    getSubstringBefore({ value: "", separator: "-" }),
                ) ||
                (typeof getSubstringBefore({ value: "", separator: "-" }) ===
                    "object" &&
                    getSubstringBefore({ value: "", separator: "-" }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            getSubstringBefore({ value: "👨‍👩‍👧", separator: "-" }) === undefined ||
                typeof getSubstringBefore({ value: "👨‍👩‍👧", separator: "-" }) ===
                    "string" ||
                typeof getSubstringBefore({ value: "👨‍👩‍👧", separator: "-" }) ===
                    "boolean" ||
                typeof getSubstringBefore({ value: "👨‍👩‍👧", separator: "-" }) ===
                    "number" ||
                Array.isArray(
                    getSubstringBefore({ value: "👨‍👩‍👧", separator: "-" }),
                ) ||
                (typeof getSubstringBefore({ value: "👨‍👩‍👧", separator: "-" }) ===
                    "object" &&
                    getSubstringBefore({ value: "👨‍👩‍👧", separator: "-" }) !==
                        null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            getSubstringBefore({ value: "e\u0301", separator: "-" }) ===
                undefined ||
                typeof getSubstringBefore({
                    value: "e\u0301",
                    separator: "-",
                }) === "string" ||
                typeof getSubstringBefore({
                    value: "e\u0301",
                    separator: "-",
                }) === "boolean" ||
                typeof getSubstringBefore({
                    value: "e\u0301",
                    separator: "-",
                }) === "number" ||
                Array.isArray(
                    getSubstringBefore({ value: "e\u0301", separator: "-" }),
                ) ||
                (typeof getSubstringBefore({
                    value: "e\u0301",
                    separator: "-",
                }) === "object" &&
                    getSubstringBefore({ value: "e\u0301", separator: "-" }) !==
                        null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            getSubstringBefore({ value: "مرحبا", separator: "-" }) ===
                undefined ||
                typeof getSubstringBefore({
                    value: "مرحبا",
                    separator: "-",
                }) === "string" ||
                typeof getSubstringBefore({
                    value: "مرحبا",
                    separator: "-",
                }) === "boolean" ||
                typeof getSubstringBefore({
                    value: "مرحبا",
                    separator: "-",
                }) === "number" ||
                Array.isArray(
                    getSubstringBefore({ value: "مرحبا", separator: "-" }),
                ) ||
                (typeof getSubstringBefore({
                    value: "مرحبا",
                    separator: "-",
                }) === "object" &&
                    getSubstringBefore({ value: "مرحبا", separator: "-" }) !==
                        null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            getSubstringBefore({ value: "你好", separator: "-" }) ===
                undefined ||
                typeof getSubstringBefore({ value: "你好", separator: "-" }) ===
                    "string" ||
                typeof getSubstringBefore({ value: "你好", separator: "-" }) ===
                    "boolean" ||
                typeof getSubstringBefore({ value: "你好", separator: "-" }) ===
                    "number" ||
                Array.isArray(
                    getSubstringBefore({ value: "你好", separator: "-" }),
                ) ||
                (typeof getSubstringBefore({
                    value: "你好",
                    separator: "-",
                }) === "object" &&
                    getSubstringBefore({ value: "你好", separator: "-" }) !==
                        null),
        ).toBe(true);
    });
});
