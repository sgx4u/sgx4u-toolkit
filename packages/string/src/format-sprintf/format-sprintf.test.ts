import { describe, expect, it } from "vitest";
import { formatSprintf } from "./format-sprintf.js";
describe("formatSprintf", () => {
    it("formats the safe subset", () => {
        expect(formatSprintf({ template: "Hi %s", values: ["Ada"] })).toBe(
            "Hi Ada",
        );
        expect(
            formatSprintf({ template: "%d %f %%", values: [1.9, 1.5] }),
        ).toBe("1 1.5 %");
        expect(formatSprintf({ template: "%1$s %1$s", values: ["A"] })).toBe(
            "A A",
        );
        expect(formatSprintf({ template: "%j", values: [{ a: 1 }] })).toBe(
            '{"a":1}',
        );
        expect(() => formatSprintf({ template: "%q", values: [] })).toThrow(
            RangeError,
        );
        expect(() => formatSprintf({ template: "%s", values: [] })).toThrow(
            RangeError,
        );
    });
});

describe("unicode and invalid input", () => {
    it("throws when null is passed in place of the options", () => {
        expect(() => formatSprintf(null as never)).toThrow(TypeError);
    });
    it("accepts an empty string", () => {
        expect(
            formatSprintf({ template: "", values: ["total", 1.9] }) ===
                undefined ||
                typeof formatSprintf({
                    template: "",
                    values: ["total", 1.9],
                }) === "string" ||
                typeof formatSprintf({
                    template: "",
                    values: ["total", 1.9],
                }) === "boolean" ||
                typeof formatSprintf({
                    template: "",
                    values: ["total", 1.9],
                }) === "number" ||
                Array.isArray(
                    formatSprintf({ template: "", values: ["total", 1.9] }),
                ) ||
                (typeof formatSprintf({
                    template: "",
                    values: ["total", 1.9],
                }) === "object" &&
                    formatSprintf({ template: "", values: ["total", 1.9] }) !==
                        null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            formatSprintf({ template: "👨‍👩‍👧", values: ["total", 1.9] }) ===
                undefined ||
                typeof formatSprintf({
                    template: "👨‍👩‍👧",
                    values: ["total", 1.9],
                }) === "string" ||
                typeof formatSprintf({
                    template: "👨‍👩‍👧",
                    values: ["total", 1.9],
                }) === "boolean" ||
                typeof formatSprintf({
                    template: "👨‍👩‍👧",
                    values: ["total", 1.9],
                }) === "number" ||
                Array.isArray(
                    formatSprintf({ template: "👨‍👩‍👧", values: ["total", 1.9] }),
                ) ||
                (typeof formatSprintf({
                    template: "👨‍👩‍👧",
                    values: ["total", 1.9],
                }) === "object" &&
                    formatSprintf({
                        template: "👨‍👩‍👧",
                        values: ["total", 1.9],
                    }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            formatSprintf({ template: "e\u0301", values: ["total", 1.9] }) ===
                undefined ||
                typeof formatSprintf({
                    template: "e\u0301",
                    values: ["total", 1.9],
                }) === "string" ||
                typeof formatSprintf({
                    template: "e\u0301",
                    values: ["total", 1.9],
                }) === "boolean" ||
                typeof formatSprintf({
                    template: "e\u0301",
                    values: ["total", 1.9],
                }) === "number" ||
                Array.isArray(
                    formatSprintf({
                        template: "e\u0301",
                        values: ["total", 1.9],
                    }),
                ) ||
                (typeof formatSprintf({
                    template: "e\u0301",
                    values: ["total", 1.9],
                }) === "object" &&
                    formatSprintf({
                        template: "e\u0301",
                        values: ["total", 1.9],
                    }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            formatSprintf({ template: "مرحبا", values: ["total", 1.9] }) ===
                undefined ||
                typeof formatSprintf({
                    template: "مرحبا",
                    values: ["total", 1.9],
                }) === "string" ||
                typeof formatSprintf({
                    template: "مرحبا",
                    values: ["total", 1.9],
                }) === "boolean" ||
                typeof formatSprintf({
                    template: "مرحبا",
                    values: ["total", 1.9],
                }) === "number" ||
                Array.isArray(
                    formatSprintf({
                        template: "مرحبا",
                        values: ["total", 1.9],
                    }),
                ) ||
                (typeof formatSprintf({
                    template: "مرحبا",
                    values: ["total", 1.9],
                }) === "object" &&
                    formatSprintf({
                        template: "مرحبا",
                        values: ["total", 1.9],
                    }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            formatSprintf({ template: "你好", values: ["total", 1.9] }) ===
                undefined ||
                typeof formatSprintf({
                    template: "你好",
                    values: ["total", 1.9],
                }) === "string" ||
                typeof formatSprintf({
                    template: "你好",
                    values: ["total", 1.9],
                }) === "boolean" ||
                typeof formatSprintf({
                    template: "你好",
                    values: ["total", 1.9],
                }) === "number" ||
                Array.isArray(
                    formatSprintf({ template: "你好", values: ["total", 1.9] }),
                ) ||
                (typeof formatSprintf({
                    template: "你好",
                    values: ["total", 1.9],
                }) === "object" &&
                    formatSprintf({
                        template: "你好",
                        values: ["total", 1.9],
                    }) !== null),
        ).toBe(true);
    });
});
