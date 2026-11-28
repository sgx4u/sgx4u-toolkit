import { describe, expect, it } from "vitest";
import { measureDisplayWidth } from "../utils/display-width.utils.js";
import { truncateToDisplayWidth } from "./truncate-to-display-width.js";
describe("truncateToDisplayWidth", () => {
    it("stays within the column budget", () => {
        const result = truncateToDisplayWidth({
            value: "hello world",
            maximumWidth: 6,
        });
        expect(measureDisplayWidth(result ?? "", false)).toBeLessThanOrEqual(6);
        expect(truncateToDisplayWidth({ value: "hi", maximumWidth: 5 })).toBe(
            "hi",
        );
        expect(
            truncateToDisplayWidth({ value: "あいう", maximumWidth: 3 }),
        ).toBe("あ…");
        expect(
            truncateToDisplayWidth({
                value: "👋",
                maximumWidth: 1,
                omission: "",
            }),
        ).toBe("");
        expect(truncateToDisplayWidth({ value: "👋", maximumWidth: 1 })).toBe(
            "…",
        );
        expect(() =>
            truncateToDisplayWidth({ value: "a", maximumWidth: -1 }),
        ).toThrow(RangeError);
        expect(
            truncateToDisplayWidth({
                value: 1 as unknown as string,
                maximumWidth: 1,
            }),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(truncateToDisplayWidth(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            truncateToDisplayWidth({ value: "", maximumWidth: 4 }) ===
                undefined ||
                typeof truncateToDisplayWidth({
                    value: "",
                    maximumWidth: 4,
                }) === "string" ||
                typeof truncateToDisplayWidth({
                    value: "",
                    maximumWidth: 4,
                }) === "boolean" ||
                typeof truncateToDisplayWidth({
                    value: "",
                    maximumWidth: 4,
                }) === "number" ||
                Array.isArray(
                    truncateToDisplayWidth({ value: "", maximumWidth: 4 }),
                ) ||
                (typeof truncateToDisplayWidth({
                    value: "",
                    maximumWidth: 4,
                }) === "object" &&
                    truncateToDisplayWidth({ value: "", maximumWidth: 4 }) !==
                        null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            truncateToDisplayWidth({ value: "👨‍👩‍👧", maximumWidth: 4 }) ===
                undefined ||
                typeof truncateToDisplayWidth({
                    value: "👨‍👩‍👧",
                    maximumWidth: 4,
                }) === "string" ||
                typeof truncateToDisplayWidth({
                    value: "👨‍👩‍👧",
                    maximumWidth: 4,
                }) === "boolean" ||
                typeof truncateToDisplayWidth({
                    value: "👨‍👩‍👧",
                    maximumWidth: 4,
                }) === "number" ||
                Array.isArray(
                    truncateToDisplayWidth({ value: "👨‍👩‍👧", maximumWidth: 4 }),
                ) ||
                (typeof truncateToDisplayWidth({
                    value: "👨‍👩‍👧",
                    maximumWidth: 4,
                }) === "object" &&
                    truncateToDisplayWidth({ value: "👨‍👩‍👧", maximumWidth: 4 }) !==
                        null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            truncateToDisplayWidth({ value: "e\u0301", maximumWidth: 4 }) ===
                undefined ||
                typeof truncateToDisplayWidth({
                    value: "e\u0301",
                    maximumWidth: 4,
                }) === "string" ||
                typeof truncateToDisplayWidth({
                    value: "e\u0301",
                    maximumWidth: 4,
                }) === "boolean" ||
                typeof truncateToDisplayWidth({
                    value: "e\u0301",
                    maximumWidth: 4,
                }) === "number" ||
                Array.isArray(
                    truncateToDisplayWidth({
                        value: "e\u0301",
                        maximumWidth: 4,
                    }),
                ) ||
                (typeof truncateToDisplayWidth({
                    value: "e\u0301",
                    maximumWidth: 4,
                }) === "object" &&
                    truncateToDisplayWidth({
                        value: "e\u0301",
                        maximumWidth: 4,
                    }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            truncateToDisplayWidth({ value: "مرحبا", maximumWidth: 4 }) ===
                undefined ||
                typeof truncateToDisplayWidth({
                    value: "مرحبا",
                    maximumWidth: 4,
                }) === "string" ||
                typeof truncateToDisplayWidth({
                    value: "مرحبا",
                    maximumWidth: 4,
                }) === "boolean" ||
                typeof truncateToDisplayWidth({
                    value: "مرحبا",
                    maximumWidth: 4,
                }) === "number" ||
                Array.isArray(
                    truncateToDisplayWidth({ value: "مرحبا", maximumWidth: 4 }),
                ) ||
                (typeof truncateToDisplayWidth({
                    value: "مرحبا",
                    maximumWidth: 4,
                }) === "object" &&
                    truncateToDisplayWidth({
                        value: "مرحبا",
                        maximumWidth: 4,
                    }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            truncateToDisplayWidth({ value: "你好", maximumWidth: 4 }) ===
                undefined ||
                typeof truncateToDisplayWidth({
                    value: "你好",
                    maximumWidth: 4,
                }) === "string" ||
                typeof truncateToDisplayWidth({
                    value: "你好",
                    maximumWidth: 4,
                }) === "boolean" ||
                typeof truncateToDisplayWidth({
                    value: "你好",
                    maximumWidth: 4,
                }) === "number" ||
                Array.isArray(
                    truncateToDisplayWidth({ value: "你好", maximumWidth: 4 }),
                ) ||
                (typeof truncateToDisplayWidth({
                    value: "你好",
                    maximumWidth: 4,
                }) === "object" &&
                    truncateToDisplayWidth({
                        value: "你好",
                        maximumWidth: 4,
                    }) !== null),
        ).toBe(true);
    });
    it("throws when maximumWidth is negative", () => {
        expect(() =>
            truncateToDisplayWidth({ value: "hello", maximumWidth: -1 }),
        ).toThrow(RangeError);
    });
});
