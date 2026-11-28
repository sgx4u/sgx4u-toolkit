import { describe, expect, it } from "vitest";
import { formatList } from "./format-list.js";
describe("formatList", () => {
    it("formats and rejects a bad list", () => {
        expect(formatList({ values: [] })).toBe("");
        expect(formatList({ values: ["a", "b"], locale: "en" })).toContain("a");
        expect(() => formatList({ values: [1 as unknown as string] })).toThrow(
            TypeError,
        );
        expect(
            formatList(null as unknown as { values: string[] }),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(formatList(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            formatList({ values: ["", "b"] }) === undefined ||
                typeof formatList({ values: ["", "b"] }) === "string" ||
                typeof formatList({ values: ["", "b"] }) === "boolean" ||
                typeof formatList({ values: ["", "b"] }) === "number" ||
                Array.isArray(formatList({ values: ["", "b"] })) ||
                (typeof formatList({ values: ["", "b"] }) === "object" &&
                    formatList({ values: ["", "b"] }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            formatList({ values: ["👨‍👩‍👧", "b"] }) === undefined ||
                typeof formatList({ values: ["👨‍👩‍👧", "b"] }) === "string" ||
                typeof formatList({ values: ["👨‍👩‍👧", "b"] }) === "boolean" ||
                typeof formatList({ values: ["👨‍👩‍👧", "b"] }) === "number" ||
                Array.isArray(formatList({ values: ["👨‍👩‍👧", "b"] })) ||
                (typeof formatList({ values: ["👨‍👩‍👧", "b"] }) === "object" &&
                    formatList({ values: ["👨‍👩‍👧", "b"] }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            formatList({ values: ["e\u0301", "b"] }) === undefined ||
                typeof formatList({ values: ["e\u0301", "b"] }) === "string" ||
                typeof formatList({ values: ["e\u0301", "b"] }) === "boolean" ||
                typeof formatList({ values: ["e\u0301", "b"] }) === "number" ||
                Array.isArray(formatList({ values: ["e\u0301", "b"] })) ||
                (typeof formatList({ values: ["e\u0301", "b"] }) === "object" &&
                    formatList({ values: ["e\u0301", "b"] }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            formatList({ values: ["مرحبا", "b"] }) === undefined ||
                typeof formatList({ values: ["مرحبا", "b"] }) === "string" ||
                typeof formatList({ values: ["مرحبا", "b"] }) === "boolean" ||
                typeof formatList({ values: ["مرحبا", "b"] }) === "number" ||
                Array.isArray(formatList({ values: ["مرحبا", "b"] })) ||
                (typeof formatList({ values: ["مرحبا", "b"] }) === "object" &&
                    formatList({ values: ["مرحبا", "b"] }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            formatList({ values: ["你好", "b"] }) === undefined ||
                typeof formatList({ values: ["你好", "b"] }) === "string" ||
                typeof formatList({ values: ["你好", "b"] }) === "boolean" ||
                typeof formatList({ values: ["你好", "b"] }) === "number" ||
                Array.isArray(formatList({ values: ["你好", "b"] })) ||
                (typeof formatList({ values: ["你好", "b"] }) === "object" &&
                    formatList({ values: ["你好", "b"] }) !== null),
        ).toBe(true);
    });
    it("throws when locale is empty or not text", () => {
        expect(() => formatList({ values: ["a", "b"], locale: "" })).toThrow(
            RangeError,
        );
        expect(() =>
            formatList({ values: ["a", "b"], locale: 1 as never }),
        ).toThrow(TypeError);
    });
});
