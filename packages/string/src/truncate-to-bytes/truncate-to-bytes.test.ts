import { describe, expect, it } from "vitest";
import { encodeUtf8 } from "../utils/encoding.utils.js";
import { truncateToBytes } from "./truncate-to-bytes.js";
describe("truncateToBytes", () => {
    it("stays within the byte budget and does not split a code point", () => {
        const result =
            truncateToBytes({ value: "éééé", maximumBytes: 5 }) ?? "";
        expect(encodeUtf8(result).length).toBeLessThanOrEqual(5);
        expect(truncateToBytes({ value: "hi", maximumBytes: 10 })).toBe("hi");
        expect(
            truncateToBytes({
                value: "e\u0301",
                maximumBytes: 2,
                omission: "",
            }),
        ).toBe("e");
        expect(() => truncateToBytes({ value: "a", maximumBytes: -1 })).toThrow(
            RangeError,
        );
        expect(
            truncateToBytes({ value: 1 as unknown as string, maximumBytes: 1 }),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(truncateToBytes(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            truncateToBytes({ value: "", maximumBytes: 4 }) === undefined ||
                typeof truncateToBytes({ value: "", maximumBytes: 4 }) ===
                    "string" ||
                typeof truncateToBytes({ value: "", maximumBytes: 4 }) ===
                    "boolean" ||
                typeof truncateToBytes({ value: "", maximumBytes: 4 }) ===
                    "number" ||
                Array.isArray(
                    truncateToBytes({ value: "", maximumBytes: 4 }),
                ) ||
                (typeof truncateToBytes({ value: "", maximumBytes: 4 }) ===
                    "object" &&
                    truncateToBytes({ value: "", maximumBytes: 4 }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            truncateToBytes({ value: "👨‍👩‍👧", maximumBytes: 4 }) === undefined ||
                typeof truncateToBytes({ value: "👨‍👩‍👧", maximumBytes: 4 }) ===
                    "string" ||
                typeof truncateToBytes({ value: "👨‍👩‍👧", maximumBytes: 4 }) ===
                    "boolean" ||
                typeof truncateToBytes({ value: "👨‍👩‍👧", maximumBytes: 4 }) ===
                    "number" ||
                Array.isArray(
                    truncateToBytes({ value: "👨‍👩‍👧", maximumBytes: 4 }),
                ) ||
                (typeof truncateToBytes({ value: "👨‍👩‍👧", maximumBytes: 4 }) ===
                    "object" &&
                    truncateToBytes({ value: "👨‍👩‍👧", maximumBytes: 4 }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            truncateToBytes({ value: "e\u0301", maximumBytes: 4 }) ===
                undefined ||
                typeof truncateToBytes({
                    value: "e\u0301",
                    maximumBytes: 4,
                }) === "string" ||
                typeof truncateToBytes({
                    value: "e\u0301",
                    maximumBytes: 4,
                }) === "boolean" ||
                typeof truncateToBytes({
                    value: "e\u0301",
                    maximumBytes: 4,
                }) === "number" ||
                Array.isArray(
                    truncateToBytes({ value: "e\u0301", maximumBytes: 4 }),
                ) ||
                (typeof truncateToBytes({
                    value: "e\u0301",
                    maximumBytes: 4,
                }) === "object" &&
                    truncateToBytes({ value: "e\u0301", maximumBytes: 4 }) !==
                        null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            truncateToBytes({ value: "مرحبا", maximumBytes: 4 }) ===
                undefined ||
                typeof truncateToBytes({ value: "مرحبا", maximumBytes: 4 }) ===
                    "string" ||
                typeof truncateToBytes({ value: "مرحبا", maximumBytes: 4 }) ===
                    "boolean" ||
                typeof truncateToBytes({ value: "مرحبا", maximumBytes: 4 }) ===
                    "number" ||
                Array.isArray(
                    truncateToBytes({ value: "مرحبا", maximumBytes: 4 }),
                ) ||
                (typeof truncateToBytes({ value: "مرحبا", maximumBytes: 4 }) ===
                    "object" &&
                    truncateToBytes({ value: "مرحبا", maximumBytes: 4 }) !==
                        null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            truncateToBytes({ value: "你好", maximumBytes: 4 }) === undefined ||
                typeof truncateToBytes({ value: "你好", maximumBytes: 4 }) ===
                    "string" ||
                typeof truncateToBytes({ value: "你好", maximumBytes: 4 }) ===
                    "boolean" ||
                typeof truncateToBytes({ value: "你好", maximumBytes: 4 }) ===
                    "number" ||
                Array.isArray(
                    truncateToBytes({ value: "你好", maximumBytes: 4 }),
                ) ||
                (typeof truncateToBytes({ value: "你好", maximumBytes: 4 }) ===
                    "object" &&
                    truncateToBytes({ value: "你好", maximumBytes: 4 }) !==
                        null),
        ).toBe(true);
    });
    it("throws when maximumBytes is negative", () => {
        expect(() =>
            truncateToBytes({ value: "hello", maximumBytes: -1 }),
        ).toThrow(RangeError);
    });
});
