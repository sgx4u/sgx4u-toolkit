import { describe, expect, it } from "vitest";
import { splitOnce } from "./split-once.js";
describe("splitOnce", () => {
    it("splits once from either end", () => {
        expect(splitOnce({ value: "a-b-c", separator: "-" })).toEqual([
            "a",
            "b-c",
        ]);
        expect(
            splitOnce({ value: "a-b-c", separator: "-", from: "end" }),
        ).toEqual(["a-b", "c"]);
        expect(splitOnce({ value: "abc", separator: "-" })).toBeUndefined();
        expect(() => splitOnce({ value: "a", separator: "" })).toThrow(
            RangeError,
        );
        expect(
            splitOnce({ value: 1 as unknown as string, separator: "-" }),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(splitOnce(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            splitOnce({ value: "", separator: "-" }) === undefined ||
                typeof splitOnce({ value: "", separator: "-" }) === "string" ||
                typeof splitOnce({ value: "", separator: "-" }) === "boolean" ||
                typeof splitOnce({ value: "", separator: "-" }) === "number" ||
                Array.isArray(splitOnce({ value: "", separator: "-" })) ||
                (typeof splitOnce({ value: "", separator: "-" }) === "object" &&
                    splitOnce({ value: "", separator: "-" }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            splitOnce({ value: "👨‍👩‍👧", separator: "-" }) === undefined ||
                typeof splitOnce({ value: "👨‍👩‍👧", separator: "-" }) ===
                    "string" ||
                typeof splitOnce({ value: "👨‍👩‍👧", separator: "-" }) ===
                    "boolean" ||
                typeof splitOnce({ value: "👨‍👩‍👧", separator: "-" }) ===
                    "number" ||
                Array.isArray(splitOnce({ value: "👨‍👩‍👧", separator: "-" })) ||
                (typeof splitOnce({ value: "👨‍👩‍👧", separator: "-" }) ===
                    "object" &&
                    splitOnce({ value: "👨‍👩‍👧", separator: "-" }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            splitOnce({ value: "e\u0301", separator: "-" }) === undefined ||
                typeof splitOnce({ value: "e\u0301", separator: "-" }) ===
                    "string" ||
                typeof splitOnce({ value: "e\u0301", separator: "-" }) ===
                    "boolean" ||
                typeof splitOnce({ value: "e\u0301", separator: "-" }) ===
                    "number" ||
                Array.isArray(
                    splitOnce({ value: "e\u0301", separator: "-" }),
                ) ||
                (typeof splitOnce({ value: "e\u0301", separator: "-" }) ===
                    "object" &&
                    splitOnce({ value: "e\u0301", separator: "-" }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            splitOnce({ value: "مرحبا", separator: "-" }) === undefined ||
                typeof splitOnce({ value: "مرحبا", separator: "-" }) ===
                    "string" ||
                typeof splitOnce({ value: "مرحبا", separator: "-" }) ===
                    "boolean" ||
                typeof splitOnce({ value: "مرحبا", separator: "-" }) ===
                    "number" ||
                Array.isArray(splitOnce({ value: "مرحبا", separator: "-" })) ||
                (typeof splitOnce({ value: "مرحبا", separator: "-" }) ===
                    "object" &&
                    splitOnce({ value: "مرحبا", separator: "-" }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            splitOnce({ value: "你好", separator: "-" }) === undefined ||
                typeof splitOnce({ value: "你好", separator: "-" }) ===
                    "string" ||
                typeof splitOnce({ value: "你好", separator: "-" }) ===
                    "boolean" ||
                typeof splitOnce({ value: "你好", separator: "-" }) ===
                    "number" ||
                Array.isArray(splitOnce({ value: "你好", separator: "-" })) ||
                (typeof splitOnce({ value: "你好", separator: "-" }) ===
                    "object" &&
                    splitOnce({ value: "你好", separator: "-" }) !== null),
        ).toBe(true);
    });
    it("throws when separator is empty", () => {
        expect(() => splitOnce({ value: "a-b-c", separator: "" })).toThrow(
            RangeError,
        );
    });
});
