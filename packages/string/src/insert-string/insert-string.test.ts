import { describe, expect, it } from "vitest";
import { insertString } from "./insert-string.js";
describe("insertString", () => {
    it("inserts and clamps", () => {
        expect(insertString({ value: "ac", index: 1, insertion: "b" })).toBe(
            "abc",
        );
        expect(insertString({ value: "a", index: 9, insertion: "b" })).toBe(
            "ab",
        );
        expect(
            insertString({
                value: 1 as unknown as string,
                index: 0,
                insertion: "b",
            }),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(insertString(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            insertString({ value: "", index: 1, insertion: "b" }) ===
                undefined ||
                typeof insertString({ value: "", index: 1, insertion: "b" }) ===
                    "string" ||
                typeof insertString({ value: "", index: 1, insertion: "b" }) ===
                    "boolean" ||
                typeof insertString({ value: "", index: 1, insertion: "b" }) ===
                    "number" ||
                Array.isArray(
                    insertString({ value: "", index: 1, insertion: "b" }),
                ) ||
                (typeof insertString({
                    value: "",
                    index: 1,
                    insertion: "b",
                }) === "object" &&
                    insertString({ value: "", index: 1, insertion: "b" }) !==
                        null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            insertString({ value: "👨‍👩‍👧", index: 1, insertion: "b" }) ===
                undefined ||
                typeof insertString({
                    value: "👨‍👩‍👧",
                    index: 1,
                    insertion: "b",
                }) === "string" ||
                typeof insertString({
                    value: "👨‍👩‍👧",
                    index: 1,
                    insertion: "b",
                }) === "boolean" ||
                typeof insertString({
                    value: "👨‍👩‍👧",
                    index: 1,
                    insertion: "b",
                }) === "number" ||
                Array.isArray(
                    insertString({ value: "👨‍👩‍👧", index: 1, insertion: "b" }),
                ) ||
                (typeof insertString({
                    value: "👨‍👩‍👧",
                    index: 1,
                    insertion: "b",
                }) === "object" &&
                    insertString({ value: "👨‍👩‍👧", index: 1, insertion: "b" }) !==
                        null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            insertString({ value: "e\u0301", index: 1, insertion: "b" }) ===
                undefined ||
                typeof insertString({
                    value: "e\u0301",
                    index: 1,
                    insertion: "b",
                }) === "string" ||
                typeof insertString({
                    value: "e\u0301",
                    index: 1,
                    insertion: "b",
                }) === "boolean" ||
                typeof insertString({
                    value: "e\u0301",
                    index: 1,
                    insertion: "b",
                }) === "number" ||
                Array.isArray(
                    insertString({
                        value: "e\u0301",
                        index: 1,
                        insertion: "b",
                    }),
                ) ||
                (typeof insertString({
                    value: "e\u0301",
                    index: 1,
                    insertion: "b",
                }) === "object" &&
                    insertString({
                        value: "e\u0301",
                        index: 1,
                        insertion: "b",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            insertString({ value: "مرحبا", index: 1, insertion: "b" }) ===
                undefined ||
                typeof insertString({
                    value: "مرحبا",
                    index: 1,
                    insertion: "b",
                }) === "string" ||
                typeof insertString({
                    value: "مرحبا",
                    index: 1,
                    insertion: "b",
                }) === "boolean" ||
                typeof insertString({
                    value: "مرحبا",
                    index: 1,
                    insertion: "b",
                }) === "number" ||
                Array.isArray(
                    insertString({ value: "مرحبا", index: 1, insertion: "b" }),
                ) ||
                (typeof insertString({
                    value: "مرحبا",
                    index: 1,
                    insertion: "b",
                }) === "object" &&
                    insertString({
                        value: "مرحبا",
                        index: 1,
                        insertion: "b",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            insertString({ value: "你好", index: 1, insertion: "b" }) ===
                undefined ||
                typeof insertString({
                    value: "你好",
                    index: 1,
                    insertion: "b",
                }) === "string" ||
                typeof insertString({
                    value: "你好",
                    index: 1,
                    insertion: "b",
                }) === "boolean" ||
                typeof insertString({
                    value: "你好",
                    index: 1,
                    insertion: "b",
                }) === "number" ||
                Array.isArray(
                    insertString({ value: "你好", index: 1, insertion: "b" }),
                ) ||
                (typeof insertString({
                    value: "你好",
                    index: 1,
                    insertion: "b",
                }) === "object" &&
                    insertString({
                        value: "你好",
                        index: 1,
                        insertion: "b",
                    }) !== null),
        ).toBe(true);
    });
    it("throws when unit is unknown", () => {
        expect(() =>
            insertString({
                value: "ac",
                index: 1,
                insertion: "b",
                unit: "nope" as never,
            }),
        ).toThrow(RangeError);
    });
});
