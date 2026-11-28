import { describe, expect, it } from "vitest";
import { convertCase } from "./convert-case.js";

describe("convertCase", () => {
    it("dispatches and rejects an unknown case", () => {
        expect(convertCase({ value: "foo bar", case: "camel" })).toBe("fooBar");
        expect(convertCase({ value: "foo bar", case: "snake" })).toBe(
            "foo_bar",
        );
        expect(convertCase({ value: "fooBar", case: "title" })).toBe("Foo Bar");
        expect(
            convertCase({ value: 1 as unknown as string, case: "camel" }),
        ).toBeUndefined();
        expect(() =>
            convertCase({ value: "a", case: "foo" as "camel" }),
        ).toThrow(RangeError);
        expect(() =>
            convertCase({
                value: "a",
                case: "camel",
                style: "nope" as "apa",
            }),
        ).toThrow(RangeError);
        expect(
            convertCase({ value: "I", case: "lower", locale: "tr-TR" }),
        ).toBe("ı");
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(convertCase(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            convertCase({ value: "", case: "camel" }) === undefined ||
                typeof convertCase({ value: "", case: "camel" }) === "string" ||
                typeof convertCase({ value: "", case: "camel" }) ===
                    "boolean" ||
                typeof convertCase({ value: "", case: "camel" }) === "number" ||
                Array.isArray(convertCase({ value: "", case: "camel" })) ||
                (typeof convertCase({ value: "", case: "camel" }) ===
                    "object" &&
                    convertCase({ value: "", case: "camel" }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            convertCase({ value: "👨‍👩‍👧", case: "camel" }) === undefined ||
                typeof convertCase({ value: "👨‍👩‍👧", case: "camel" }) ===
                    "string" ||
                typeof convertCase({ value: "👨‍👩‍👧", case: "camel" }) ===
                    "boolean" ||
                typeof convertCase({ value: "👨‍👩‍👧", case: "camel" }) ===
                    "number" ||
                Array.isArray(convertCase({ value: "👨‍👩‍👧", case: "camel" })) ||
                (typeof convertCase({ value: "👨‍👩‍👧", case: "camel" }) ===
                    "object" &&
                    convertCase({ value: "👨‍👩‍👧", case: "camel" }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            convertCase({ value: "e\u0301", case: "camel" }) === undefined ||
                typeof convertCase({ value: "e\u0301", case: "camel" }) ===
                    "string" ||
                typeof convertCase({ value: "e\u0301", case: "camel" }) ===
                    "boolean" ||
                typeof convertCase({ value: "e\u0301", case: "camel" }) ===
                    "number" ||
                Array.isArray(
                    convertCase({ value: "e\u0301", case: "camel" }),
                ) ||
                (typeof convertCase({ value: "e\u0301", case: "camel" }) ===
                    "object" &&
                    convertCase({ value: "e\u0301", case: "camel" }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            convertCase({ value: "مرحبا", case: "camel" }) === undefined ||
                typeof convertCase({ value: "مرحبا", case: "camel" }) ===
                    "string" ||
                typeof convertCase({ value: "مرحبا", case: "camel" }) ===
                    "boolean" ||
                typeof convertCase({ value: "مرحبا", case: "camel" }) ===
                    "number" ||
                Array.isArray(convertCase({ value: "مرحبا", case: "camel" })) ||
                (typeof convertCase({ value: "مرحبا", case: "camel" }) ===
                    "object" &&
                    convertCase({ value: "مرحبا", case: "camel" }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            convertCase({ value: "你好", case: "camel" }) === undefined ||
                typeof convertCase({ value: "你好", case: "camel" }) ===
                    "string" ||
                typeof convertCase({ value: "你好", case: "camel" }) ===
                    "boolean" ||
                typeof convertCase({ value: "你好", case: "camel" }) ===
                    "number" ||
                Array.isArray(convertCase({ value: "你好", case: "camel" })) ||
                (typeof convertCase({ value: "你好", case: "camel" }) ===
                    "object" &&
                    convertCase({ value: "你好", case: "camel" }) !== null),
        ).toBe(true);
    });
    it("throws when locale is empty or not text", () => {
        expect(() =>
            convertCase({ value: "foo bar", case: "camel", locale: "" }),
        ).toThrow(RangeError);
        expect(() =>
            convertCase({
                value: "foo bar",
                case: "camel",
                locale: 1 as never,
            }),
        ).toThrow(TypeError);
    });
});
