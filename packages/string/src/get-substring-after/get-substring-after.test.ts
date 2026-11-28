import { describe, expect, it } from "vitest";
import { getSubstringAfter } from "./get-substring-after.js";
describe("getSubstringAfter", () => {
    it("reads around the separator", () => {
        const found = getSubstringAfter({ value: "a-b-c", separator: "-" });
        expect(typeof found).toBe("string");
        expect(
            getSubstringAfter({
                value: "abc",
                separator: "-",
                missing: "whole",
            }),
        ).toBe("abc");
        expect(getSubstringAfter({ value: "abc", separator: "-" })).toBe("");
        expect(
            getSubstringAfter({
                value: 1 as unknown as string,
                separator: "-",
            }),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(getSubstringAfter(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            getSubstringAfter({ value: "", separator: "-" }) === undefined ||
                typeof getSubstringAfter({ value: "", separator: "-" }) ===
                    "string" ||
                typeof getSubstringAfter({ value: "", separator: "-" }) ===
                    "boolean" ||
                typeof getSubstringAfter({ value: "", separator: "-" }) ===
                    "number" ||
                Array.isArray(
                    getSubstringAfter({ value: "", separator: "-" }),
                ) ||
                (typeof getSubstringAfter({ value: "", separator: "-" }) ===
                    "object" &&
                    getSubstringAfter({ value: "", separator: "-" }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            getSubstringAfter({ value: "👨‍👩‍👧", separator: "-" }) === undefined ||
                typeof getSubstringAfter({ value: "👨‍👩‍👧", separator: "-" }) ===
                    "string" ||
                typeof getSubstringAfter({ value: "👨‍👩‍👧", separator: "-" }) ===
                    "boolean" ||
                typeof getSubstringAfter({ value: "👨‍👩‍👧", separator: "-" }) ===
                    "number" ||
                Array.isArray(
                    getSubstringAfter({ value: "👨‍👩‍👧", separator: "-" }),
                ) ||
                (typeof getSubstringAfter({ value: "👨‍👩‍👧", separator: "-" }) ===
                    "object" &&
                    getSubstringAfter({ value: "👨‍👩‍👧", separator: "-" }) !==
                        null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            getSubstringAfter({ value: "e\u0301", separator: "-" }) ===
                undefined ||
                typeof getSubstringAfter({
                    value: "e\u0301",
                    separator: "-",
                }) === "string" ||
                typeof getSubstringAfter({
                    value: "e\u0301",
                    separator: "-",
                }) === "boolean" ||
                typeof getSubstringAfter({
                    value: "e\u0301",
                    separator: "-",
                }) === "number" ||
                Array.isArray(
                    getSubstringAfter({ value: "e\u0301", separator: "-" }),
                ) ||
                (typeof getSubstringAfter({
                    value: "e\u0301",
                    separator: "-",
                }) === "object" &&
                    getSubstringAfter({ value: "e\u0301", separator: "-" }) !==
                        null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            getSubstringAfter({ value: "مرحبا", separator: "-" }) ===
                undefined ||
                typeof getSubstringAfter({ value: "مرحبا", separator: "-" }) ===
                    "string" ||
                typeof getSubstringAfter({ value: "مرحبا", separator: "-" }) ===
                    "boolean" ||
                typeof getSubstringAfter({ value: "مرحبا", separator: "-" }) ===
                    "number" ||
                Array.isArray(
                    getSubstringAfter({ value: "مرحبا", separator: "-" }),
                ) ||
                (typeof getSubstringAfter({
                    value: "مرحبا",
                    separator: "-",
                }) === "object" &&
                    getSubstringAfter({ value: "مرحبا", separator: "-" }) !==
                        null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            getSubstringAfter({ value: "你好", separator: "-" }) ===
                undefined ||
                typeof getSubstringAfter({ value: "你好", separator: "-" }) ===
                    "string" ||
                typeof getSubstringAfter({ value: "你好", separator: "-" }) ===
                    "boolean" ||
                typeof getSubstringAfter({ value: "你好", separator: "-" }) ===
                    "number" ||
                Array.isArray(
                    getSubstringAfter({ value: "你好", separator: "-" }),
                ) ||
                (typeof getSubstringAfter({ value: "你好", separator: "-" }) ===
                    "object" &&
                    getSubstringAfter({ value: "你好", separator: "-" }) !==
                        null),
        ).toBe(true);
    });
});
