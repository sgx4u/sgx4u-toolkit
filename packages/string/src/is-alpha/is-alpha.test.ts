import { describe, expect, it } from "vitest";
import { isAlpha } from "./is-alpha.js";

describe("isAlpha", () => {
    it("accepts letters in the requested script", () => {
        expect(isAlpha("Hello")).toBe(true);
        expect(isAlpha("Héllo")).toBe(true);
        expect(isAlpha("")).toBe(false);
        expect(isAlpha("abc1")).toBe(false);
        expect(isAlpha({ value: "abc", locale: "ascii" })).toBe(true);
        expect(isAlpha({ value: "ä", locale: "ascii" })).toBe(false);
        expect(isAlpha({ value: "Привет", locale: "ru" })).toBe(true);
        expect(isAlpha({ value: "Hello", locale: "ru" })).toBe(false);
        expect(isAlpha({ value: "こんにちは", locale: "ja-JP" })).toBe(true);
        expect(isAlpha({ value: "مرحبا", locale: "ar-SA" })).toBe(true);
        expect(isAlpha({ value: "नमस्ते", locale: "hi-IN" })).toBe(true);
        expect(isAlpha({ value: "สวัสดี", locale: "th-TH" })).toBe(true);
        expect(isAlpha({ value: "한글", locale: "ko" })).toBe(true);
        expect(isAlpha({ value: "汉字", locale: "ko" })).toBe(false);
        expect(isAlpha({ value: "汉字", locale: "zh" })).toBe(true);
        expect(isAlpha({ value: "漢字", locale: "ja" })).toBe(true);
        expect(isAlpha({ value: "한글", locale: "ja" })).toBe(false);
        expect(isAlpha({ value: "Ελλάδα", locale: "el" })).toBe(true);
        expect(isAlpha({ value: "שלום", locale: "he" })).toBe(true);
        expect(isAlpha({ value: "e\u0301", locale: "fr" })).toBe(true);
        expect(isAlpha("\u0301")).toBe(false);
        expect(isAlpha({ value: "α", locale: "zz" })).toBe(true);
        expect(isAlpha({ value: "İstanbul", locale: "tr" })).toBe(true);
        expect(isAlpha(null)).toBe(false);
        expect(() => isAlpha({ value: "a", locale: "" })).toThrow(RangeError);
    });

    it("rejects a locale that is not a string", () => {
        expect(() =>
            isAlpha({ value: "a", locale: 1 as unknown as string }),
        ).toThrow(TypeError);
    });
});
